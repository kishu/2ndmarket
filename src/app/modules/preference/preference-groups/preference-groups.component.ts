import { random } from 'lodash-es';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { filter, first, map, shareReplay, skip, switchMap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AuthService, GroupsService, ProfilesService } from '@app/core/http';
import { NewProfile } from '@app/core/model';
import { ProfileSelectService } from '@app/core/util';

@Component({
  selector: 'app-preference-groups',
  templateUrl: './preference-groups.component.html',
  styleUrls: ['./preference-groups.component.scss']
})
export class PreferenceGroupsComponent implements OnInit, OnDestroy {
  private code: number;
  emailForm: FormGroup;
  verifyForm: FormGroup;

  step$ = new BehaviorSubject<number>(1);

  step1$ = this.step$.pipe(
    filter(step => step === 1)
  ).subscribe(() => {
    this.emailForm = this.fb.group({
      account: [''],
      domain: ['']
    });
    this.emailForm.enable();
  });

  step2$ = this.step$.pipe(
    filter(step => step === 2)
  ).subscribe(() => {
    this.resetLimitTimer$.next(true);
    this.emailForm.disable();
    this.verifyForm = this.fb.group({
      email: [{ value: this.email, disabled: true }],
      code: []
    });
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
    private groupsService: GroupsService,
    private profilesService: ProfilesService,
    private profileSelectService: ProfileSelectService
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.step1$.unsubscribe();
    this.step2$.unsubscribe();

    this.step$.complete();
    this.resetLimitTimer$.complete();
  }

  onEmailSubmit() {
    this.step$.next(2);
    this.emailForm.disable();
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
    this.step$.next(1);
  }

  onClickRetryCode() {
    this.sendMail();
    this.resetLimitTimer$.next(true);
  }

  // function addNewProfile() {
  //   this.authService.user$.pipe(first()).subscribe(user => {
  //     return this.profilesService.add({
  //       groupId,
  //       displayName: this.email.split('@')[0],
  //       email: this.email,
  //       photoURL: '',
  //       userIds: [userId],
  //       created: ProfilesService.serverTimestamp()
  //     } as NewProfile);
  //   });
  // };
  //
  // function updateAddUserIdToProfile(profile) {
  //   return this.profilesService.updateUserIdAdd(profileId, userId);
  // };


  onVerifySubmit() {
    this.verifyForm.disable();
    if (this.code !== parseInt(this.codeCtl.value, 10)) {
      this.verifyForm.setErrors({ incorrect: true });
      this.verifyForm.enable();
      return;
    }

    forkJoin([
      this.authService.user$.pipe(first()),
      this.groups$.pipe(first(), map(groups => groups.find(g => g.domains.includes(this.domainCtl.value)))),
      this.profilesService.getQueryByEmail(this.email)
    ]).pipe(
      switchMap(([user, profiles]) => {

      })
    )



    // 내 이메일이 있는 프로파일 찾는다.
    // 있다면 그걸로 연결
    // 없다면 등록 수 연결

    this.profilesService.getQueryByEmail(this.email).subscribe(profiles =>
      profiles.length === 0 ?
        this.addNewProfile() :
        this.updateAddUserIdToProfile(profiles[0]);
    );






    forkJoin([
      this.authService.user$.pipe(first()),
      this.groups$.pipe(first(), map(groups => groups.find(g => g.domains.includes(this.domainCtl.value))))
    ]).pipe(
      switchMap(([user, group]) => {
        return this.profilesService.getQueryByEmailAndGroupId(this.email, group.id).pipe(
          switchMap(profiles => {
            return profiles.length === 0 ?
              addNewProfile(group.id, this.email, user.id).then(profile => this.profileSelectService.select(profile.id)) :
              updateAddUserIdToProfile(profiles[0].id, user.id).then(() => this.profileSelectService.select(profiles[0].id));
          })
        );
      })
    ).subscribe();




    // forkJoin([
    //   this.groups$.pipe(first(), map(groups => groups.find(g => g.domains.some(d => d === domain)))),
    //   this.authService.user$.pipe(first(), filter(u => !!u))
    // ]).pipe(
    //   switchMap(([group, user]) => {
    //     return this.profilesService.getQueryByEmailAndGroupId(this.email, group.id).pipe(
    //       switchMap(profiles => {
    //         return profiles.length === 0 ?
    //           addNewProfile(group.id, this.email, user.id).then(profile => this.profileSelectService.select(profile.id)) :
    //           updateAddUserIdToProfile(profiles[0].id, user.id).then(() => this.profileSelectService.select(profiles[0].id));
    //       })
    //     );
    //   })
    // ).subscribe(() => {
    //   this.authService.profileExt$.pipe(skip(1), first()).subscribe(p => {
    //     // this.persistenceService.reset(p).then(() => {
    //     //   this.router.navigate(['/goods']);
    //     // });
    //   });
    // });
  }

  onClickHistoryBack() {
    this.location.back();
  }

}
