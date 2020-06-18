import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "@app/shared/shared.module";
import { GoodsRoutingModule } from './goods-routing.module';
import { GoodsListComponent } from './goods-list/goods-list.component';
import { GoodsFormComponent } from './goods-form/goods-form.component';
import { GoodsWriteComponent } from './goods-write/goods-write.component';
import { GoodsWrite2Component } from './goods-write2/goods-write2.component';

@NgModule({
  declarations: [
    GoodsListComponent,
    GoodsWriteComponent,
    GoodsWrite2Component,
    GoodsFormComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    GoodsRoutingModule
  ]
})
export class GoodsModule { }
