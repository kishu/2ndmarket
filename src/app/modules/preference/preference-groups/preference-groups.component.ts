import { head, isEmpty, random } from 'lodash-es';
import { BehaviorSubject, merge, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { filter, first, map, share, shareReplay, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AuthService, GroupsService, MembershipsService, Profiles2Service, ProfilesService, UserInfosService } from '@app/core/http';
import { ProfileSelectService } from '@app/core/business';
import { CoverService } from '@app/modules/components/services';
import { Group, NewMembership, NewProfile, NewProfile2, Profile } from '@app/core/model';
import { firestore } from 'firebase/app';

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
    private membershipsService: MembershipsService,
    private profilesService: ProfilesService,
    private profiles2Service: Profiles2Service,
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
    console.log(code);

    // const callable = this.fns.httpsCallable('sendVerificationEmail');
    // callable({to, code}).pipe(first()).subscribe(() => {
      // i don't know why this subscribe function run outside of ngzone.
      // this is just tricky code.
      // this.ngZone.run(() => {
        this.code = code;
      // });
    // });
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

    const membership$ = this.membershipsService
      .getQueryByUserIdAndGroupId(selectedGroup.id, user.id)
      .pipe(
        first(),
        share(),
        map(memberships => head(memberships))
      );

    const existence$ = membership$.pipe(
      first(),
      filter(m => !!m),
      switchMap(m => this.membershipsService.activate(m.id)),
      switchMap(() => of(null)),
    );

    const nonexistence$ = membership$.pipe(
      first(),
      filter(m => !m),
      switchMap(() => this.profiles2Service.getQueryByEmail(email).pipe(first(), map(p => head(p)))),
      switchMap(p => {
        if (p) {
          return of(p.id);
        } else {
          return this.profiles2Service.add({
            userId: user.id,
            email,
            displayName: email.split('@')[0],
            photoURL: '',
            created: Profiles2Service.serverTimestamp()
          } as NewProfile2).then(doc => doc.id);
        }
      }),
      switchMap(profileId => {
        return this.membershipsService.add({
          userId: user.id,
          userEmail: user.email,
          groupId: selectedGroup.id,
          profileId,
          activated: MembershipsService.serverTimestamp(),
          created: MembershipsService.serverTimestamp()
        } as NewMembership);
      }),
      map(m => m.id)
    );

    merge(existence$, nonexistence$).pipe(
      first(),
    ).subscribe(result => {
      if (!result){
        alert('you have membership already.');
      }
      this.authService.changeMembership$.next();
      this.router.navigate(['/goods']);
      this.coverService.hide();
    }, err => {
      alert(err);
      this.coverService.hide();
    });


    //
    //
    // // if profile existed
    // const membership$ = profile2$.pipe(
    //   first(),
    //
    //
    //   switchMap(({id: profileId}) => {
    //     const { id: userId, email: userEmail } = this.authService.user;
    //     return this.membershipsService.add({
    //       userId,
    //       userEmail,
    //       groupId: selectedGroup.id,
    //       profileId,
    //       activated: MembershipsService.serverTimestamp(),
    //       created: MembershipsService.serverTimestamp()
    //     } as NewMembership);
    //   })
    // );

    // if not profile existed
    // const create2$ = profile2$.pipe(
    //   first(),
    //   filter(mp => !p),
    //   switchMap(() => {
    //     const { id: userId } = this.authService.user;
    //     return this.profiles2Service.add({
    //       userId,
    //       email,
    //       displayName: email.split('@')[0],
    //       photoURL: '',
    //       created: Profiles2Service.serverTimestamp()
    //     } as NewProfile2);
    //   }),
    //   switchMap(profile => {
    //     const { id: userId, email: userEmail } = this.authService.user;
    //     return this.membershipsService.add({
    //       userId,
    //       userEmail,
    //       groupId: selectedGroup.id,
    //       profileId: profile.id,
    //       activated: MembershipsService.serverTimestamp(),
    //       created: MembershipsService.serverTimestamp()
    //     } as NewMembership);
    //   })
    // );

    // const profiles$ =
    //   this.profiles2Service
    //   .getQueryByEmailAndGroupId_D(email, selectedGroup.id)
    //   .pipe(
    //     first(),
    //     share()
    //   );

    // no profile contains email given email, add new profile
    // const create$ = profiles$.pipe(
    //   first(),
    //   filter(profiles => isEmpty(profiles)),
    //   tap(t => console.log(1, t)),
    //   switchMap(() => {
    //     return this.profiles2Service.add_D({
    //       groupId: selectedGroup.id,
    //       displayName: email.split('@')[0],
    //       email,
    //       photoURL: '',
    //       userIds: [ user.id ],
    //       created: ProfilesService.serverTimestamp()
    //     } as NewProfile);
    //   }),
    //   map(docRef => docRef.id)
    // );

    // profile contains given email, add user id to profile.users
    // const update$ = profiles$.pipe(
    //   first(),
    //   filter(profiles => !isEmpty(profiles)),
    //   tap(t => console.log(2, t)),
    //   map(profiles => head(profiles) as Profile),
    //   switchMap(profile => {
    //     return fromPromise(
    //       this.profiles2Service.updateUserIdAdd_D(profile.id, user.id)
    //     ).pipe(
    //       map(() => profile)
    //     );
    //   }),
    //   map(profile => profile.id)
    // );

    // merge(create$, update$).pipe(
    //   first(),
    //   switchMap(profileId => this.profileSelectService.select(profileId)),
    // ).subscribe(() => {
    //   this.coverService.hide();
    //   this.router.navigate(['/goods']);
    // }, err => {
    //   alert(err);
    //   this.coverService.hide();
    // });
  }

}
