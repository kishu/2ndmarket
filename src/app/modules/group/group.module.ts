import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "@app/shared/shared.module";
import { GroupRoutingModule } from './group-routing.module';
import { GroupAddComponent } from './group-add/group-add.component';
import { GroupListComponent } from './group-list/group-list.component';

@NgModule({
  declarations: [GroupAddComponent, GroupListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    GroupRoutingModule
  ]
})
export class GroupModule { }
