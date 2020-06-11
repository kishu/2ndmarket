import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export enum SignInStep {
  email = 'email',
  auth = 'auth'
}

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  emailForm: FormGroup;
  authForm: FormGroup;
  submitting = false;
  // step = SignInStep.email;
  step = SignInStep.auth;

  get account() { return this.emailForm.get('account'); }
  get domain() { return this.emailForm.get('domain'); }

  constructor(private fb: FormBuilder) {
    this.emailForm = this.fb.group({
      account: ['kishu'],
      domain: ['webtoonscorp.com']
    });
  }

  ngOnInit(): void {
  }

  reset(): void {
  }

  submit(): void {
  }

}
