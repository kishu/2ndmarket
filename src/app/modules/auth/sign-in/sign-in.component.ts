import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export enum SignInStep {
  email = 'email',
  code = 'code'
}

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  step = SignInStep.code;
  emailForm: FormGroup;
  codeForm: FormGroup;
  submitting = false;
  finishedLimitTimer = false;

  get account() { return this.emailForm.get('account'); }
  get domain() { return this.emailForm.get('domain'); }
  get code() { return this.codeForm.get('code'); }

  constructor(private fb: FormBuilder) {
    this.emailForm = this.fb.group({
      account: ['kishu'],
      domain: ['webtoonscorp.com']
    });

    this.codeForm = this.fb.group({
      code: ['']
    });
  }

  ngOnInit() {
  }

  retry() {
    this.step = SignInStep.email;
  }

  submitEmail() {
    this.step = SignInStep.code;
    this.finishedLimitTimer = false;
  }

  onFinishedLimitTimer() {
    this.finishedLimitTimer = true;
  }

  submitCode() {

  }

}
