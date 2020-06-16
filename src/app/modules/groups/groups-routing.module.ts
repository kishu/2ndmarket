import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { GroupsAddComponent } from './groups-add/groups-add.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['sign-in']);

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'groups/add', component: GroupsAddComponent, ...canActivate(redirectUnauthorizedToLogin) }
    ])
  ],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }
