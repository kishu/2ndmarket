import { random } from 'lodash-es';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { filter, first, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AuthService, GroupsService, ProfilesService } from '@app/core/http';
import { NewProfile } from '@app/core/model';
import { ProfileSelectService } from '@app/core/util';

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

  get accountCtl() { return this.emailForm.get('account'); }
  get domainCtl() { return this.emailForm.get('domain'); }
  get email() { return `${this.accountCtl.value.trim()}@${this.domainCtl.value}`; }
  get codeCtl() { return this.verifyForm.get('code'); }

  constructor(
    private ngZone: NgZone,
    private location: Location,
    private router: Router,
    private fb: FormBuilder,
    private fns: AngularFireFunctions,
    private authService: AuthService,
    private groupsService: GroupsService,
    private profilesService: ProfilesService,
    private profileSelectService: ProfileSelectService
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
            email: [{ value: this.email, disabled: true }],
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
    console.log(code);
    const callable = this.fns.httpsCallable('sendVerificationEmail');
    callable({to, code}).pipe(first()).subscribe(() => {
      // i don't know why this subscribe function run outside of ngzone.
      // this is just tricky code.
      this.ngZone.run(() => {
        this.code = code;
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
    const addNewProfile = (groupId, email, userId) => {
      return this.profilesService.add({
        groupId,
        displayName: email.split('@')[0],
        email,
        photoURL: '',
        userIds: [userId],
        created: ProfilesService.serverTimestamp()
      } as NewProfile);
    };
    const updateAddUserIdToProfile = (profileId, userId) => {
      return this.profilesService.updateAddUserId(profileId, userId);
    };
    forkJoin([
      this.groups$.pipe(first(), map(groups => groups.find(g => g.domains.some(d => d === domain)))),
      this.authService.user$.pipe(first(), filter(u => !!u))
    ]).pipe(
      switchMap(([group, user]) => {
        return this.profilesService.getQueryByEmailAndGroupId(this.email, group.id).pipe(
          switchMap(profiles => {
            return profiles.length === 0 ?
              addNewProfile(group.id, this.email, user.id).then(profile => this.profileSelectService.select(profile.id)) :
              updateAddUserIdToProfile(profiles[0].id, user.id).then(() => this.profileSelectService.select(profiles[0].id));
          }),
          switchMap(() => this.router.navigate(['/groups', group.id, 'goods']))
        );
      })
    ).subscribe(() => {}, err => alert(err));
  }

  onClickHistoryBack() {
    this.location.back();
  }

}
