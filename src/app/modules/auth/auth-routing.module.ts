import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { canActivate, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignIn2Component } from "./sign-in2/sign-in2.component";
import { SignIn3Component } from '@app/modules/auth/sign-in3/sign-in3.component';
import { SignInResultComponent } from './sign-in-result/sign-in-result.component';
import { SignUpComponent } from '@app/modules/auth/sign-up/sign-up.component';
import { SignIn4Component } from '@app/modules/auth/sign-in4/sign-in4.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'sign-up',
        component: SignUpComponent,
      },
      {
        path: 'sign-in',
        component: SignIn4Component,
      },
      {
        path: 'sign-in-result',
        component: SignInResultComponent
      }
    ])
  ],
  exports: [RouterModule]
})

export class AuthRoutingModule { }
