import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { canActivate, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { SignInComponent } from './sign-in/sign-in.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'sign-in',
        component: SignInComponent,
      }
    ])
  ],
  exports: [RouterModule]
})

export class AuthRoutingModule { }
