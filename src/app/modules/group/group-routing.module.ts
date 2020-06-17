import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { GroupListComponent } from "./group-list/group-list.component";
import { GroupAddComponent } from './group-add/group-add.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['sign-in']);

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'groups', component: GroupListComponent, ...canActivate(redirectUnauthorizedToLogin) },
      { path: 'groups/add', component: GroupAddComponent, ...canActivate(redirectUnauthorizedToLogin) }
    ])
  ],
  exports: [RouterModule]
})
export class GroupRoutingModule { }
