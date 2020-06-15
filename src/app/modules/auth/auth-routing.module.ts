import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { canActivate, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignInResultComponent } from './sign-in-result/sign-in-result.component';

const redirectLoggedInToItems = () => redirectLoggedInTo(['']);

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'sign-in',
        component: SignInComponent,
        ...canActivate(redirectLoggedInToItems),
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
