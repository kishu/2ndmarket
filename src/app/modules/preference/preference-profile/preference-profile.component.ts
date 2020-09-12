import { isEmpty, head } from 'lodash-es';
import { merge } from 'rxjs';
import { filter, first, map, mapTo, share, switchMap, tap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AuthService, CloudinaryUploadService, ProfilesService } from '@app/core/http';
import { ProfileSelectService } from '@app/core/business';
import { CoverService } from '@app/modules/components/services';
import { DraftImage } from '@app/core/model';

@Component({
  selector: 'app-preference-profile, [app-preference-profile]',
  templateUrl: './preference-profile.component.html',
  styleUrls: ['./preference-profile.component.scss']
})
export class PreferenceProfileComponent implements OnInit {
  submitting = false;
  changingFile = false;
  draftImage: DraftImage;
  profileForm = this.fb.group({
    displayName: [],
  });

  profile$ = this.authService.profileExt$.pipe(
    first(),
    filter(p => !!p),
    tap(profile => this.displayNameCtl.setValue(profile.displayName)),
    tap(profile => {
      this.draftImage = {
        isFile: false,
        src: profile.photoURL,
        rotate: 0
      };
    })
  );

  get displayNameCtl() { return this.profileForm.get('displayName'); }

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private coverService: CoverService,
    private profilesService: ProfilesService,
    private profileSelectService: ProfileSelectService,
    private cloudinaryUploadService: CloudinaryUploadService
  ) {
  }

  ngOnInit(): void {
  }

  onChangeFile(e: Event) {
    this.changingFile = true;
    const target = e.target as HTMLInputElement;
    this.draftImage = {
      isFile: true,
      file: target.files[0],
      rotate: 0
    };
    target.value = '';
  }

  onClickRotateImage(rotate) {
    this.draftImage = {
      ...this.draftImage,
      rotate: (this.draftImage.rotate + rotate) % 360
    };
  }

  onCancelChangeFile(e: Event) {
    this.changingFile = false;
    this.authService.profileExt$.pipe(
      first(),
      filter(p => !!p)
    ).subscribe(profile => {
      this.draftImage = {
        isFile: false,
        src: profile.photoURL,
        rotate: 0
      };
    });
  }

  onSubmit() {
    if (this.submitting) {
      return;
    }
    this.submitting = true;
    this.authService.profileExt$.pipe(
      first(),
      filter(p => !!p)
    ).subscribe(p => {
      this.draftImage = {
        ...this.draftImage,
        context: `type=profile|id=${p.id}`
      };
      const [uploadProgress$, uploadComplete$] = this.cloudinaryUploadService.upload([this.draftImage]);
      uploadComplete$.subscribe(/* uploaded urls*/urls => {
        this.profilesService.update(p.id, {
          photoURL: urls[0],
          displayName: this.displayNameCtl.value
        }).then(() => {
          this.profileSelectService.select(p.id);
          alert('프로필을 변경했습니다!');
          this.submitting = false;
          this.changingFile = false;
        }, err => {
          alert(err);
        });
      });
    });
  }

  onRemoveProfile() {
    if (!confirm('프로필 연결을 해제하시겠습니까?\n등록하신 상품과 댓글을 지워지지 않습니다.\n(메일 재인증을 통해 언제든 프로필을 다시 연결할 수 있습니다.)')) {
      return;
    }

    this.coverService.show('프로필을 재설정하고 있습니다.');

    const { user, profile } = this.authService;
    const profiles$ = fromPromise(this.profilesService.updateUserIdRemove(profile.id, user.id)).pipe(
      switchMap(() => this.profilesService.getQueryByUserId(user.id)),
      share()
    );

    const select$ = profiles$.pipe(
      first(),
      filter(profiles => !isEmpty(profiles)),
      map(p => head(p)),
      switchMap(p => this.profileSelectService.select(p.id)),
      mapTo(true)
    );

    const remove$ = profiles$.pipe(
      first(),
      filter(profiles => isEmpty(profiles)),
      tap(() => this.profileSelectService.remove()),
      mapTo(false)
    );

    merge(select$, remove$).pipe(
      first()
    ).subscribe((selected) => {
      this.coverService.hide();
      this.router.navigate(selected ? ['/goods'] : ['/preference', 'goods']);
    });
  }

  onClickHistoryBack() {
    this.location.back();
  }
}
