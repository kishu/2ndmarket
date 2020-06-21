import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { GoodsRoutingModule } from './goods-routing.module';
import { GoodsListComponent } from './goods-list/goods-list.component';
import { GoodsDetailComponent } from './goods-detail/goods-detail.component';
import { GoodsFormComponent } from './goods-form/goods-form.component';
import { GoodsWriteComponent } from './goods-write/goods-write.component';
import { GoodsWrite2Component } from './goods-write2/goods-write2.component';
import { GoodsEditComponent } from './goods-edit/goods-edit.component';
import { GoodsCommentListComponent } from './goods-comment-list/goods-comment-list.component';
import { GoodsCommentFormComponent } from './goods-comment-form/goods-comment-form.component';

@NgModule({
  declarations: [
    GoodsListComponent,
    GoodsDetailComponent,
    GoodsFormComponent,
    GoodsWriteComponent,
    GoodsWrite2Component,
    GoodsEditComponent,
    GoodsCommentListComponent,
    GoodsCommentFormComponent
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
