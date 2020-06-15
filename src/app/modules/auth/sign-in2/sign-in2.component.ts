import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, from, Observable, throwError } from "rxjs";
import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { AuthService, GroupService, SignInEmailService } from "@app/core/http";
import { NewSignInEmail } from "@app/core/model";
import { filter, first, map, switchMap, tap } from "rxjs/operators";

export enum SignInStep {
  account = 'account',
  verification = 'verification',
}

@Component({
  selector: 'app-sign-in2',
  templateUrl: './sign-in2.component.html',
  styleUrls: ['./sign-in2.component.scss']
})

export class SignIn2Component implements OnInit, OnDestroy {
  code: number;
  ref: string;
  submitted = false;
  step$ = new BehaviorSubject<SignInStep>(SignInStep.account);
  domains$: Observable<string[]>;
  accountForm =  this.fb.group({
    account: ['kishu'],
    domain: ['']
  });

  get accountCtl() { return this.accountForm.get('account'); }
  get domainCtl() { return this.accountForm.get('domain'); }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private groupService: GroupService,
    private signInEmailService: SignInEmailService
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

  retry() {
    this.step$.next(SignInStep.account);
  }

  verify() {
  }

  submit() {
    let ref;
    this.submitted = true;

    const email = `${this.accountCtl.value}@${this.domainCtl.value}`;
    const signInEmail: NewSignInEmail = {
      email,
      verified: false,
      created: SignInEmailService.serverTimestamp()
    };

    from(this.signInEmailService.add(signInEmail)).pipe(
      tap(r => ref = r),
      switchMap(() => this.authService.sendSignInLinkToEmail(email, ref.id)),
      tap(() => this.step$.next(SignInStep.verification)),
      switchMap(() => this.signInEmailService.get(ref.id)),
      filter(doc => doc && doc.verified),
      first(),
      switchMap(doc => this.authService.signInWithEmailLink(doc.email, ref.id))
    ).subscribe(
      r => {
        console.log('rr', r);
        this.submitted = false;
        if (r && r?.additionalUserInfo && r.additionalUserInfo.isNewUser) {
          this.router.navigate(['']);
        } else if (r && r.user) {
          this.router.navigate(['']);
        }
      }
    );
  }

}
