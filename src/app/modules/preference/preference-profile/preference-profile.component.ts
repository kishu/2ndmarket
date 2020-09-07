import { forkJoin } from 'rxjs';
import { filter, first, switchMap, tap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DraftImage } from '@app/core/model';
import { Router } from '@angular/router';
import { AuthService, CloudinaryUploadService, ProfilesService } from '@app/core/http';
import { ProfileSelectService } from '@app/core/util';

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
    forkJoin([
      this.authService.user$.pipe(first(), filter(u => !!u)),
      this.authService.profileExt$.pipe(first(), filter(p => !!p))
    ]).pipe(
      switchMap(([u, p]) => {
        return fromPromise(this.profilesService.updateUserIdRemove(p.id, u.id)).pipe(
          switchMap(() => this.profilesService.getQueryByUserId(u.id))
        );
      })
    ).subscribe(profiles => {
      const [profile] = profiles;
      if (profile) {
        this.profileSelectService.select(profile.id);
        this.router.navigate(['/goods']);
      } else {
        this.profileSelectService.select(null);
        this.router.navigate(['/preference', 'groups']);
      }
    });
  }

  // onClickSignOut(e: Event) {
  //   e.preventDefault();
  //   this.authService.signOut();
  //   this.router.navigate(['/sign-in']);
  // }

  onClickHistoryBack() {
    this.location.back();
  }
}
