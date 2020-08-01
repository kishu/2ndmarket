import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { PreferenceRoutingModule } from './preference-routing.module';
import { PreferenceProfileComponent } from './preference-profile/preference-profile.component';
import { PreferenceGroupsComponent } from './preference-groups/preference-groups.component';
import { PreferenceMessagesComponent } from './preference-messages/preference-messages.component';
import { PreferenceWriteGoodsComponent } from './preference-write-goods/preference-write-goods.component';
import { PreferenceFavoriteGoodsComponent } from './preference-favorite-goods/preference-favorite-goods.component';
import { PreferenceProfileBootstrapComponent } from './preference-profile-bootstrap/preference-profile-bootstrap.component';

@NgModule({
  declarations: [
    PreferenceProfileComponent,
    PreferenceGroupsComponent,
    PreferenceMessagesComponent,
    PreferenceWriteGoodsComponent,
    PreferenceFavoriteGoodsComponent,
    PreferenceProfileBootstrapComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PreferenceRoutingModule
  ]
})
export class PreferenceModule { }
