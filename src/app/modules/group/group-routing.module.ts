import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GroupBootstrapComponent } from './group-bootstrap/group-bootstrap.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'groups/:groupId/bootstrap', component: GroupBootstrapComponent }
    ])
  ],
  exports: [RouterModule]
})
export class GroupRoutingModule { }
