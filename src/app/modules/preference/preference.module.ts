import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { PreferenceRoutingModule } from './preference-routing.module';
import { PreferenceProfileComponent } from './preference-profile/preference-profile.component';
import { PreferenceGroupsComponent } from './preference-groups/preference-groups.component';
import { PreferenceMessagesComponent } from './preference-messages/preference-messages.component';
import { PreferenceWrittenGoodsComponent } from './preference-written-goods/preference-written-goods.component';
import { PreferenceFavoritedGoodsComponent } from './preference-favorited-goods/preference-favorited-goods.component';

@NgModule({
  declarations: [
    PreferenceProfileComponent,
    PreferenceGroupsComponent,
    PreferenceMessagesComponent,
    PreferenceWrittenGoodsComponent,
    PreferenceFavoritedGoodsComponent
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
