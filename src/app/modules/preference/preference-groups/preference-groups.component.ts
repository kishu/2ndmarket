import { head, isEmpty, random } from 'lodash-es';
import { BehaviorSubject, forkJoin, Subject } from 'rxjs';
import { filter, first, map, share, shareReplay, skip, switchMap, withLatestFrom } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AuthService, GroupsService, ProfilesService } from '@app/core/http';
import { Group, NewProfile } from '@app/core/model';
import { ProfileSelectService } from '@app/core/util';
import { fromPromise } from 'rxjs/internal-compatibility';

@Component({
  selector: 'app-preference-groups',
  templateUrl: './preference-groups.component.html',
  styleUrls: ['./preference-groups.component.scss']
})
export class PreferenceGroupsComponent implements OnInit, OnDestroy {
  private code: number;
  private selectedGroup: Group;
  step$ = new BehaviorSubject<number>(1);
  emailForm = this.fb.group({
    account: [''],
    domain: ['']
  });
  verifyForm = this.fb.group({
    email: [{ value: this.email, disabled: true }],
    code: []
  });
  resetLimitTimer$ = new BehaviorSubject(false);
  resetLimitTimer = false;
  groups$ = this.groupsService.getAll().pipe(
    map(groups => groups.sort((a, b) => a.name.localeCompare(b.name))),
    map(groups => groups.map(group => ({ ...group, domains: group.domains.sort() }))),
    shareReplay({ refCount: true, bufferSize: 1})
  );
  get accountCtl() { return this.emailForm.get('account'); }
  get domainCtl() { return this.emailForm.get('domain'); }
  get emailCtl() { return this.verifyForm.get('email'); }
  get codeCtl() { return this.verifyForm.get('code'); }
  get email() { return `${this.accountCtl.value.trim()}@${this.domainCtl.value}`; }


  // step1$ = this.step$.pipe(
  //   filter(step => step === 1)
  // ).subscribe(() => {
  //
  // });
  //
  // step2$ = this.step$.pipe(
  //   filter(step => step === 2)
  // ).subscribe(() => {
  //   // this.resetLimitTimer$.next(true);
  //   this.emailForm.disable();
  // });



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
  }

  ngOnInit(): void {
    this.emailForm.get('domain').valueChanges.pipe(
      withLatestFrom(this.groups$)
    ).subscribe(([domain, groups]) => {
      this.selectedGroup = groups.find(g => g.domains.includes(domain));
    });
  }

  ngOnDestroy() {
    // this.step1$.unsubscribe();
    // this.step2$.unsubscribe();
    //
    this.step$.complete();
    this.resetLimitTimer$.complete();
  }

  onEmailSubmit() {
    this.step$.next(2);
    this.sendMail();
  }

  sendMail() {
    const to = this.email;
    const code = random(1000, 9999);
    console.log(code);

    const callable = this.fns.httpsCallable('sendVerificationEmail');
    // callable({to, code}).pipe(first()).subscribe(() => {
    // i don't know why this subscribe function run outside of ngzone.
    // this is just tricky code.
    this.ngZone.run(() => {
      this.code = code;
    });
    // });
  }

  onTimeoverLimitTimer() {
    this.verifyForm.setErrors({ timeover: true });
  }

  onClickRetryStep1() {
    this.emailForm.reset();
    this.verifyForm.reset();
    this.step$.next(1);
  }

  onClickRetryCode() {
    this.sendMail();
    this.resetLimitTimer$.next(true);
  }

  onVerifySubmit() {
    this.verifyForm.disable();

    if (this.code !== parseInt(this.codeCtl.value, 10)) {
      this.verifyForm.setErrors({ incorrect: true });
      this.verifyForm.enable();
      return;
    }

    const email = this.email;
    const user = this.authService.user;
    const selectedGroup = this.selectedGroup;

    const profiles$ =
      this.profilesService
      .getQueryByEmailAndGroupId(email, selectedGroup.id)
      .pipe(first(), share());

    // no profile contains email given email, add new profile
    profiles$
      .pipe(
        first(),
        filter(p => isEmpty(p)),
        switchMap(() => {
          return this.profilesService.add({
            groupId: selectedGroup.id,
            displayName: email.split('@')[0],
            email,
            photoURL: '',
            userIds: [ user.id ],
            created: ProfilesService.serverTimestamp()
          } as NewProfile);
        })
      ).subscribe(newProfile => {
        this.profileSelectService.select(newProfile.id);
      });

    // profile contains given email, add user id to profile.users
    profiles$
      .pipe(
        first(),
        filter(p => !isEmpty(p)),
        map(profiles => head(profiles)),
        switchMap(profile => {
          return fromPromise(
            this.profilesService.updateUserIdAdd(profile.id, user.id)
          ).pipe(
            map(x => profile)
          );
        })
      ).subscribe(profile => {
        this.profileSelectService.select(profile.id);
      });
  }

  onClickHistoryBack() {
    this.location.back();
  }

}
