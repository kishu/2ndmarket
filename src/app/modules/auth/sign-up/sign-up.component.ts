import { Observable } from "rxjs";
import { first, map } from "rxjs/operators";
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder } from '@angular/forms';
import { AuthService, GroupService } from "@app/core/http";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  submitting = false;
  domains$: Observable<string[]>;
  signUpForm = this.fb.group({
    account: ['kishu'],
    domain: [''],
    password1: [''],
    password2: ['']
  });

  get accountCtl() { return this.signUpForm.get('account'); }
  get domainCtl() { return this.signUpForm.get('domain'); }
  get password1Ctl() { return this.signUpForm.get('password1'); }
  get password2Ctl() { return this.signUpForm.get('password2'); }

  constructor(
    private router: Router,
    private fb: FormBuilder,
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

  ngOnInit(): void {
  }

  submit() {
    this.submitting = true;
    this.authService
      .createUserWithEmailAndPassword(
        `${this.accountCtl.value.trim()}@${this.domainCtl.value.trim()}`,
        this.password1Ctl.value.trim())
      .then(credential => credential.user.sendEmailVerification())
      .then(() => this.router.navigate(['sign-in-result']))
      .catch(err => {
        console.log(err);
        if (err.code === 'auth/email-already-in-use') {
        }
      });
  }


}
