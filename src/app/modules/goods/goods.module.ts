import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { GoodsRoutingModule } from './goods-routing.module';
import { GoodsDetailComponent } from './goods-detail/goods-detail.component';
import { GoodsFormComponent } from './goods-form/goods-form.component';
import { GoodsWriteComponent } from './goods-write/goods-write.component';
import { GoodsEditComponent } from './goods-edit/goods-edit.component';
import { GoodsCommentListComponent } from './goods-comment-list/goods-comment-list.component';
import { GoodsCommentFormComponent } from './goods-comment-form/goods-comment-form.component';
import { GoodsMoreComponent } from './goods-more/goods-more.component';
import { GoodsListComponent } from './goods-list/goods-list.component';
import { GoodsListItemComponent } from './goods-list-item/goods-list-item.component';
import { GoodsImageViewerComponent } from './goods-image-viewer/goods-image-viewer.component';
import { GoodsSearchFormComponent } from './goods-search-form/goods-search-form.component';

@NgModule({
  declarations: [
    GoodsCommentFormComponent,
    GoodsCommentListComponent,
    GoodsDetailComponent,
    GoodsEditComponent,
    GoodsFormComponent,
    GoodsImageViewerComponent,
    GoodsListComponent,
    GoodsListItemComponent,
    GoodsSearchFormComponent,
    GoodsMoreComponent,
    GoodsWriteComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    GoodsRoutingModule
  ],
  providers: [
    DecimalPipe
  ]
})
export class GoodsModule { }
