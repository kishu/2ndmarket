import { Observable } from "rxjs";
import { first, map } from "rxjs/operators";
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupService } from "@app/core/http";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in3.component.html',
  styleUrls: ['./sign-in3.component.scss']
})
export class SignIn3Component implements OnInit {
  submitting = false;
  domains$: Observable<string[]>;
  signInForm = this.fb.group({
    account: ['kishu'],
    domain: [''],
    password: ['']
  });

  get accountCtl() { return this.signInForm.get('account'); }
  get domainCtl() { return this.signInForm.get('domain'); }
  get passwordCtl() { return this.signInForm.get('password'); }

  constructor(
    private fb: FormBuilder,
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

  submit(): void {
  }

}
