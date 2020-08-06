import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PreferenceProfileComponent } from './preference-profile/preference-profile.component';
import { PreferenceGroupsComponent } from './preference-groups/preference-groups.component';
import { PreferenceMessagesComponent } from './preference-messages/preference-messages.component';
import { PreferenceWrittenGoodsComponent } from './preference-written-goods/preference-written-goods.component';
import { PreferenceFavoritedGoodsComponent } from './preference-favorited-goods/preference-favorited-goods.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'preference/profile', component: PreferenceProfileComponent },
      { path: 'preference/groups', component: PreferenceGroupsComponent },
      { path: 'preference/messages', component: PreferenceMessagesComponent },
      { path: 'preference/written-goods', component: PreferenceWrittenGoodsComponent },
      { path: 'preference/favorited-goods', component: PreferenceFavoritedGoodsComponent }
    ])
  ],
  exports: [RouterModule]
})
export class PreferenceRoutingModule { }
