import { head, isEmpty, random } from 'lodash-es';
import { BehaviorSubject, merge } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { filter, first, map, share, shareReplay, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AuthService, GroupsService, ProfilesService, UserInfosService } from '@app/core/http';
import { ProfileSelectService } from '@app/core/business';
import { CoverService } from '@app/modules/components/services';
import { Group, NewProfile, Profile } from '@app/core/model';

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

  constructor(
    private ngZone: NgZone,
    private location: Location,
    private router: Router,
    private fb: FormBuilder,
    private fns: AngularFireFunctions,
    private authService: AuthService,
    private coverService: CoverService,
    private groupsService: GroupsService,
    private profilesService: ProfilesService,
    private profileSelectService: ProfileSelectService,
  ) {
  }

  ngOnInit(): void {
    this.step$.pipe(
      filter(s => s === 1)
    ).subscribe(() => {
      this.emailForm.reset();
      this.domainCtl.setValue('');
    });

    this.step$.pipe(
      filter(s => s === 2)
    ).subscribe(() => {
      this.verifyForm.reset();
      this.emailCtl.setValue(this.email);
    });

    this.emailForm.get('domain').valueChanges.pipe(
      withLatestFrom(this.groups$)
    ).subscribe(([domain, groups]) => {
      this.selectedGroup = groups.find(g => g.domains.includes(domain));
    });
  }

  ngOnDestroy() {
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
    // console.log(code);

    const callable = this.fns.httpsCallable('sendVerificationEmail');
    callable({to, code}).pipe(first()).subscribe(() => {
      // i don't know why this subscribe function run outside of ngzone.
      // this is just tricky code.
      this.ngZone.run(() => {
        this.code = code;
      });
    });
  }

  onTimeoverLimitTimer() {
    this.verifyForm.setErrors({ timeover: true });
  }

  onClickRetryStep1() {
    this.verifyForm.reset();
    this.step$.next(1);
  }

  onClickRetryCode() {
    this.sendMail();
    this.step$.next(2);
    alert('인증번호를 재전송했습니다.');
    this.resetLimitTimer$.next(true);
  }

  onClickHistoryBack() {
    this.location.back();
  }

  onVerifySubmit() {
    this.verifyForm.disable();

    if (this.code !== parseInt(this.codeCtl.value, 10)) {
      this.verifyForm.enable();
      this.verifyForm.setErrors({ incorrect: true });
      return;
    }

    this.coverService.show('프로필을 설정하고 있습니다.');

    const email = this.email;
    const user = this.authService.user;
    const selectedGroup = this.selectedGroup;

    const profiles$ =
      this.profilesService
      .getQueryByEmailAndGroupId(email, selectedGroup.id)
      .pipe(
        first(),
        tap(t => console.log(0, t)),
        share());

    // no profile contains email given email, add new profile
    const create$ = profiles$.pipe(
      first(),
      filter(profiles => isEmpty(profiles)),
      tap(t => console.log(1, t)),
      switchMap(() => {
        return this.profilesService.add({
          groupId: selectedGroup.id,
          displayName: email.split('@')[0],
          email,
          photoURL: '',
          userIds: [ user.id ],
          created: ProfilesService.serverTimestamp()
        } as NewProfile);
      }),
      map(docRef => docRef.id)
    );

    // profile contains given email, add user id to profile.users
    const update$ = profiles$.pipe(
      first(),
      filter(profiles => !isEmpty(profiles)),
      tap(t => console.log(2, t)),
      map(profiles => head(profiles) as Profile),
      switchMap(profile => {
        return fromPromise(
          this.profilesService.updateUserIdAdd(profile.id, user.id)
        ).pipe(
          map(() => profile)
        );
      }),
      map(profile => profile.id)
    );

    merge(create$, update$).pipe(
      first(),
      switchMap(profileId => this.profileSelectService.select(profileId)),
    ).subscribe(() => {
      this.coverService.hide();
      this.router.navigate(['/goods']);
    }, err => {
      alert(err);
      this.coverService.hide();
    });
  }

}
