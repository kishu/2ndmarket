import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignIn2Component } from './sign-in2/sign-in2.component';
import { SharedModule } from '@app/shared/shared.module';
import { SignInResultComponent } from './sign-in-result/sign-in-result.component';
import { SignIn3Component } from './sign-in3/sign-in3.component';
import { SignIn4Component } from './sign-in4/sign-in4.component';

@NgModule({
  declarations: [
    SignUpComponent,
    SignInComponent,
    SignIn2Component,
    SignIn3Component,
    SignInResultComponent,
    SignIn4Component
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    SharedModule,
  ]
})
export class AuthModule { }
