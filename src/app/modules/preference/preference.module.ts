import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@app/modules/components/components.module';
import { SharedModule } from '@app/shared/shared.module';
import { PreferenceComponent } from './preference/preference.component';
import { PreferenceRoutingModule } from './preference-routing.module';
import { PreferenceProfileComponent } from './preference-profile/preference-profile.component';
import { PreferenceGroupsComponent } from './preference-groups/preference-groups.component';
import { PreferenceMessagesComponent } from './preference-messages/preference-messages.component';
import { PreferenceWrittenGoodsComponent } from './preference-written-goods/preference-written-goods.component';
import { PreferenceFavoritedGoodsComponent } from './preference-favorited-goods/preference-favorited-goods.component';

@NgModule({
  declarations: [
    PreferenceComponent,
    PreferenceProfileComponent,
    PreferenceGroupsComponent,
    PreferenceMessagesComponent,
    PreferenceWrittenGoodsComponent,
    PreferenceFavoritedGoodsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PreferenceRoutingModule,
    ComponentsModule,
    SharedModule,
  ]
})
export class PreferenceModule { }
