import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { HomeModule } from '@app/modules/home/home.module';
import { PreferenceRoutingModule } from './preference-routing.module';
import { PreferenceProfileComponent } from './preference-profile/preference-profile.component';
import { PreferenceGroupsComponent } from './preference-groups/preference-groups.component';

@NgModule({
  declarations: [
    PreferenceProfileComponent,
    PreferenceGroupsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    HomeModule,
    ReactiveFormsModule,
    PreferenceRoutingModule
  ]
})
export class PreferenceModule { }
