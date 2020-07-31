import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupRoutingModule } from './group-routing.module';
import { GroupBootstrapComponent } from './group-bootstrap/group-bootstrap.component';

@NgModule({
  declarations: [
    GroupBootstrapComponent
  ],
  imports: [
    CommonModule,
    GroupRoutingModule
  ]
})

export class GroupModule { }
