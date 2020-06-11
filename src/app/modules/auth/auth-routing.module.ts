import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'sign-up', component: SignUpComponent },
      { path: 'sign-in', component: SignInComponent }
    ])
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
