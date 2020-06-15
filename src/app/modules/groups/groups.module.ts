import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroupsRoutingModule } from './groups-routing.module';
import { GroupsAddComponent } from './groups-add/groups-add.component';

@NgModule({
  declarations: [GroupsAddComponent],
  imports: [
    CommonModule,
    GroupsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class GroupsModule { }
