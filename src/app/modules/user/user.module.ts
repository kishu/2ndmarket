import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from "./user-routing.module";
import { UserComponent } from './user/user.component';
import { SharedModule } from "@app/shared/shared.module";

@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule
  ]
})
export class UserModule { }
