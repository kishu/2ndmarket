import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  submitting = false;

  get account() { return this.signUpForm.get('account'); }
  get domain() { return this.signUpForm.get('domain'); }
  get password1() { return this.signUpForm.get('password1'); }
  get password2() { return this.signUpForm.get('password2'); }

  constructor(private fb: FormBuilder) {
    this.signUpForm = this.fb.group({
      account: [''],
      domain: [''],
      password1: [''],
      password2: ['']
    });
  }

  ngOnInit(): void {
  }

  submit(): void {
  }

}
