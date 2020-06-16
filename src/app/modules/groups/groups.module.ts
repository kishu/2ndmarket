import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "@app/shared/shared.module";
import { GroupsRoutingModule } from './groups-routing.module';
import { GroupsAddComponent } from './groups-add/groups-add.component';

@NgModule({
  declarations: [GroupsAddComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    GroupsRoutingModule
  ]
})
export class GroupsModule { }
