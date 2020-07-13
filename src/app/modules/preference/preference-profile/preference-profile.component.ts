import { forkJoin } from 'rxjs';
import { filter, first, switchMap, tap } from 'rxjs/operators';
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
  photoFile: File;
  uploadedPhotoUrl: string;
  profileForm = this.fb.group({
    displayName: [],
  });

  profile$ = this.authService.profile$.pipe(
    filter(p => !!p),
    tap(profile => this.displayNameCtl.setValue(profile.displayName))
  );

  get displayNameCtl() { return this.profileForm.get('displayName'); }

  constructor(
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
    const target = e.target as HTMLInputElement;
    this.photoFile = target.files[0];
    this.uploadedPhotoUrl = '';
    target.value = '';
  }

  onCancelChangeFile(e: Event) {
    this.photoFile = null;
  }

  onSubmit() {
    if (this.submitting) {
      return;
    }
    this.submitting = true;
    this.authService.profile$.pipe(
      first(),
      filter(p => !!p)
    ).subscribe(p => {
      const draftImage: DraftImage = {
        isFile: !!this.photoFile,
        file: this.photoFile || null,
        src: this.photoFile ? '' : p.photoURL,
        rotate: 0,
        context: `type=profile|id=${p.id}`
      };
      const [uploadProgress$, uploadComplete$] = this.cloudinaryUploadService.upload([draftImage]);
      uploadComplete$.subscribe(images => {
        this.uploadedPhotoUrl = images[0];
        this.profilesService.update(p.id, {
          photoURL: images[0],
          displayName: this.displayNameCtl.value
        }).then(() => {
          this.profileSelectService.select(p.id);
          alert('프로필을 변경했습니다!');
          this.submitting = false;
          this.photoFile = null;
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
      this.authService.profile$.pipe(first(), filter(p => !!p))
    ]).pipe(
      switchMap(([u, p]) => {
        this.profilesService.updateRemoveUserId(p.id, u.id);
        return this.profilesService.getQueryByUserId(u.id);
      })
    ).subscribe(profiles => {
      const [profile] = profiles;
      profile ?
        this.profileSelectService.select(profile.id) :
        this.router.navigate(['/preference', 'groups']);
    });
  }

  // onClickSignOut(e: Event) {
  //   e.preventDefault();
  //   this.authService.signOut();
  //   this.router.navigate(['/sign-in']);
  // }
}
