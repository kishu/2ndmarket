import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PreferenceProfileComponent } from './preference-profile/preference-profile.component';
import { PreferenceGroupsComponent } from './preference-groups/preference-groups.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'preference/profile', component: PreferenceProfileComponent },
      { path: 'preference/groups', component: PreferenceGroupsComponent },
    ])
  ],
  exports: [RouterModule]
})
export class PreferenceRoutingModule { }
