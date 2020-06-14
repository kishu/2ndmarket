import { Observable } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '@app/core/http/auth.service';
import { GroupService } from '@app/core/http/group.service';

export enum SignInStep {
  account = 'account',
  verification = 'verification',
  verified = 'verified'
}

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  code: number;
  submitted = false;
  step = SignInStep.account;
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

  retry() {
    this.step = SignInStep.account;
  }

  submit() {
    this.submitted = true;
    this.authService
      .sendSignInLinkToEmail(`${this.accountCtl.value}@${this.domainCtl.value}`)
      .then(() => {
        this.step = SignInStep.verification;
        this.authService.user$.pipe(
          filter(u => !!u),
          first()
        ).subscribe(() => this.step = SignInStep.verified);
      })
      .catch(() => this.submitted = false);
  }

}
