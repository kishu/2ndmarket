import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'user', component: UserComponent, data: { reuse: true } },
    ])
  ],
  exports: [RouterModule]
})
export class UserRoutingModule { }
