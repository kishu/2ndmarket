import random from 'lodash/random';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { filter, first, map, switchMap, tap } from 'rxjs/operators';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireFunctions } from "@angular/fire/functions";
import { FormBuilder } from '@angular/forms';
import { AuthService, GroupService } from '@app/core/http';

export enum SignInStep {
  account = 'account',
  verification = 'verification'
}

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})

export class SignInComponent implements OnInit, OnDestroy {
  code: number;
  submitted = false;
  timeover = false;

  step$ = new BehaviorSubject<SignInStep>(SignInStep.account);
  domains$: Observable<string[]>;
  accountForm =  this.fb.group({
    account: ['kishu'],
    domain: ['']
  });
  verificationForm = this.fb.group({
    code: ['']
  });

  get accountCtl() { return this.accountForm.get('account'); }
  get domainCtl() { return this.accountForm.get('domain'); }
  get codeCtl() { return this.verificationForm.get('code'); }

  constructor(
    private zone: NgZone,
    private router: Router,
    private fb: FormBuilder,
    private fns: AngularFireFunctions,
    private authService: AuthService,
    private groupService: GroupService
  ) {
    this.domains$ = this.groupService
      .getAll([['created', 'desc']])
      .pipe(
        first(),
        map(groups => groups.reduce((acc, group) => acc.concat(group.domains), []).sort())
      );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.step$.complete();
  }

  onTimeoverLimitTimer() {
    this.timeover = true;
  }

  retry() {
    this.step$.next(SignInStep.account);
  }

  submitAccount() {
    this.submitted = true;

    const to = `${this.accountCtl.value}@${this.domainCtl.value}`;
    const code = random(1000, 9999);

    const callable = this.fns.httpsCallable('sendVerificationEmail');
    callable({ to, code }).subscribe((r) => {
      this.zone.run(() => {
        this.code = code;
        this.step$.next(SignInStep.verification);
        this.submitted = false;
      });
    });
  }

  submitVerification() {
    const code = parseInt(this.codeCtl.value.trim(), 10);
    if (code === this.code) {
      // this.authService.
      this.router.navigate(['']);
    } else {
      alert('인증코드를 정확히 입력하세요.');
    }

  }

}

// export class SignInComponent2 implements OnInit, OnDestroy {
//   code: number;
//   submitted = false;
//   step$ = new BehaviorSubject<SignInStep>(SignInStep.account);
//   domains$: Observable<string[]>;
//   accountForm =  this.fb.group({
//     account: ['kishu'],
//     domain: ['']
//   });
//
//   get accountCtl() { return this.accountForm.get('account'); }
//   get domainCtl() { return this.accountForm.get('domain'); }
//
//   constructor(
//     private fb: FormBuilder,
//     private router: Router,
//     private authService: AuthService,
//     private groupService: GroupService,
//     private signInEmailService: SignInEmailService
//   ) {
//     this.domains$ = this.groupService
//       .getAll([['created', 'desc']])
//       .pipe(
//         first(),
//         map(groups => groups.reduce((acc, group) => acc.concat(group.domains), []).sort())
//       );
//   }
//
//   ngOnInit() {
//   }
//
//   ngOnDestroy() {
//     this.step$.complete();
//   }
//
//   retry() {
//     this.step$.next(SignInStep.account);
//   }
//
//   async submit() {
//     this.submitted = true;
//
//     const email = `${this.accountCtl.value}@${this.domainCtl.value}`;
//     const signInEmail: NewSignInEmail = {
//       email,
//       created: SignInEmailService.serverTimestamp()
//     };
//
//     from(this.signInEmailService.add(signInEmail)).pipe(
//       switchMap(ref => this.authService.sendSignInLinkToEmail(email, ref.id)),
//       tap(() => this.step$.next(SignInStep.verification)),
//     ).subscribe(() => this.submitted = false);
//
//     this.authService.user$.pipe(
//       filter(u => !!u),
//       first()
//     ).subscribe(() => this.step$.next(SignInStep.verified));
//   }
//
// }
