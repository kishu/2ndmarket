import { random } from 'lodash-es';
import { BehaviorSubject, of } from 'rxjs';
import { filter, first, map, share, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AuthService, GroupsService, ProfilesService, UserProfilesService } from '@app/core/http';
import { SelectProfileService } from '@app/core/util';
import { NewProfile, NewUserProfile, Profile } from '@app/core/model';

enum GroupAddStep {
  email = 'email',
  verify = 'verify'
}

@Component({
  selector: 'app-preference-groups',
  templateUrl: './preference-groups.component.html',
  styleUrls: ['./preference-groups.component.scss']
})
export class PreferenceGroupsComponent implements OnInit {
  private code: number;
  submitting = false;
  emailForm: FormGroup;
  verifyForm: FormGroup;
  step$ = new BehaviorSubject<GroupAddStep>(GroupAddStep.email);
  groups$ = this.groupsService.getAll().pipe(shareReplay(1));
  domains$ = this.groups$.pipe(map(groups => groups.reduce((acc, group) => acc.concat(group.domains), []).sort()));
  userProfileList$ = this.authService.user$.pipe(
    first(),
    filter(u => !!u),
    switchMap(u => this.userProfilesService.getQueryByUserId(u.id).pipe())
  );
  selectedProfileId$ = this.selectProfileService.profileId$.pipe();

  get accountCtl() { return this.emailForm.get('account'); }
  get domainCtl() { return this.emailForm.get('domain'); }
  get email() { return `${this.accountCtl.value.trim()}@${this.domainCtl.value}`; }
  get codeCtl() { return this.verifyForm.get('code'); }

  constructor(
    private ngZone: NgZone,
    private fb: FormBuilder,
    private fns: AngularFireFunctions,
    private authService: AuthService,
    private groupsService: GroupsService,
    private profilesService: ProfilesService,
    private userProfilesService: UserProfilesService,
    private selectProfileService: SelectProfileService
  ) {
    this.step$.subscribe(step => {
      switch (step) {
        case GroupAddStep.email:
          this.emailForm = this.fb.group({
            account: [''],
            domain: [''],
          });
          break;
        case GroupAddStep.verify:
          this.verifyForm = this.fb.group({
            email: [this.email],
            code: []
          });
          break;
      }
    });
  }

  ngOnInit(): void {
  }

  onEmailSubmit() {
    this.submitting = true;
    const to = this.email;
    const code = random(1000, 9999);
    const callable = this.fns.httpsCallable('sendVerificationEmail');
    callable({to, code}).pipe(first()).subscribe(() => {
      // i don't know why this subscribe function run outside of ngzone.
      // this is just tricky code.
      this.ngZone.run(() => {
        this.code = code;
        console.log('code', code);
        this.submitting = false;
        this.step$.next(GroupAddStep.verify);
      });
    });
  }

  onTimeoverLimitTimer() {
    this.verifyForm.setErrors({ timeover: true });
    this.codeCtl.disable();
  }

  onClickRetry() {
    this.step$.next(GroupAddStep.email);
  }

  onVerifySubmit() {
    if (this.code !== parseInt(this.codeCtl.value, 10)) {
      return this.verifyForm.setErrors({ incorrect: true });
    }

    const domain = this.domainCtl.value;
    const email = this.email;

    this.groups$.pipe(
      map(groups => groups.find(g => g.domains.some(d => d === domain))),
      switchMap(group => {
        return this.profilesService.getQueryByEmailAndGroupId(email, group.id).pipe(
          switchMap(profiles => {
            return profiles.length ?
              of(profiles[0].id) :
              this.profilesService.add({
                groupId: group.id,
                displayName: email.split('@')[0],
                email,
                photoURL: '',
                created: ProfilesService.serverTimestamp()
              } as NewProfile).then(p => p.id);
            }
          )
        );
      }),
      switchMap(profileId => {
        return this.authService.user$.pipe(
          first(),
          switchMap(u => {
            return this.userProfilesService.getQueryByUserIdAndProfileId(u.id, profileId).pipe(
              switchMap(userProfiles => {
                return userProfiles.length ?
                  of(null) :
                  this.userProfilesService.add({
                    userId: u.id,
                    userEmail: u.email,
                    profileId,
                    activated: true,
                    created: UserProfilesService.serverTimestamp()
                  } as NewUserProfile);
              })
            );
          })
        );
      })
    ).subscribe(
      () => {},
      err => alert(err)
    );
  }

  onClickSelectProfile(profile: Profile) {
    this.selectProfileService.select(profile.id);
  }

}
