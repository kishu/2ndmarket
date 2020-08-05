import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { PreferenceProfileComponent } from './preference-profile/preference-profile.component';
import { PreferenceGroupsComponent } from './preference-groups/preference-groups.component';
import { PreferenceMessagesComponent } from './preference-messages/preference-messages.component';
import { PreferenceWriteGoodsComponent } from './preference-write-goods/preference-write-goods.component';
import { PreferenceFavoriteGoodsComponent } from './preference-favorite-goods/preference-favorite-goods.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    PreferenceProfileComponent,
    PreferenceGroupsComponent,
    PreferenceMessagesComponent,
    PreferenceWriteGoodsComponent,
    PreferenceFavoriteGoodsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ]
})
export class PreferenceModule { }
