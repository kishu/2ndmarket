import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AngularFireFunctions } from '@angular/fire/functions';
import { BehaviorSubject } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import random from 'lodash/random';

export enum SignInStep {
  account = 'account',
  verification = 'verification'
}

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  code: number;
  submitting = false;
  limitTimer = false;
  timeover = false;
  step$ = new BehaviorSubject<SignInStep>(SignInStep.account);
  accountForm =  this.fb.group({
    account: ['kishu'],
    domain: ['webtoonscorp.com']
  });
  verificationForm = this.fb.group({
    code: ['']
  });

  get accountCtl() { return this.accountForm.get('account'); }
  get domainCtl() { return this.accountForm.get('domain'); }
  get codeCtl() { return this.verificationForm.get('code'); }

  constructor(
    private fb: FormBuilder,
    private fns: AngularFireFunctions,
    private ref: ChangeDetectorRef
  ) {
    this.step$.subscribe(step => {
      console.log(step);
      this.limitTimer = (step === SignInStep.verification);
    });
  }

  ngOnInit() {
  }

  retry() {
    this.step$.next(SignInStep.account);
  }

  submitAccount() {
    this.submitting = true;
    this.code = random(1000, 9999);
    console.log(this.code);
    const callable = this.fns.httpsCallable('sendVerificationEmail');
    callable({
      to: `${this.accountCtl.value}@${this.domainCtl.value}`,
      code: this.code
    })
      .pipe(
        first(),
        tap(() => {
          this.submitting = false;
          this.ref.detectChanges();
        })
      )
      .subscribe(
        () => {
          this.step$.next(SignInStep.verification);
          this.ref.detectChanges();
        },
        (err) => alert(err)
      );
  }

  onTimeoverLimitTimer() {
    this.timeover = true;
  }

  submitVerification() {
    this.submitting = true;
    if (this.codeCtl.value === this.code) {
      console.log('ok');
    } else {
      console.log('fail');
    }
  }

}
