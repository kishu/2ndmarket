import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PreferenceProfileComponent } from './preference-profile/preference-profile.component';
import { PreferenceProfileBootstrapComponent } from './preference-profile-bootstrap/preference-profile-bootstrap.component';
import { PreferenceGroupsComponent } from './preference-groups/preference-groups.component';
import { PreferenceMessagesComponent } from './preference-messages/preference-messages.component';
import { PreferenceWriteGoodsComponent } from './preference-write-goods/preference-write-goods.component';
import { PreferenceFavoriteGoodsComponent } from './preference-favorite-goods/preference-favorite-goods.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'preference/profile', component: PreferenceProfileComponent },
      { path: 'preference/profile/:profileId/bootstrap', component: PreferenceFavoriteGoodsComponent },
      { path: 'preference/groups', component: PreferenceGroupsComponent },
      { path: 'preference/messages', component: PreferenceMessagesComponent },
      { path: 'preference/write-goods', component: PreferenceWriteGoodsComponent },
      { path: 'preference/favorite-goods', component: PreferenceFavoriteGoodsComponent },
      { path: 'preference/favorite-goods', component: PreferenceFavoriteGoodsComponent },
    ])
  ],
  exports: [RouterModule]
})
export class PreferenceRoutingModule { }
