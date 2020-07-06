import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PreferenceProfileComponent } from './preference-profile/preference-profile.component';
import { PreferenceGroupsComponent } from './preference-groups/preference-groups.component';
import { PreferenceMessagesComponent } from './preference-messages/preference-messages.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'preference/profile', component: PreferenceProfileComponent },
      { path: 'preference/groups', component: PreferenceGroupsComponent },
      { path: 'preference/messages', component: PreferenceMessagesComponent },
    ])
  ],
  exports: [RouterModule]
})
export class PreferenceRoutingModule { }
