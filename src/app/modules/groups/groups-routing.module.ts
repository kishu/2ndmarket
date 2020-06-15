import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GroupsAddComponent } from './groups-add/groups-add.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'groups/add', component: GroupsAddComponent },
    ])
  ],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }
