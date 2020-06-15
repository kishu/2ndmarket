import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoodsRoutingModule } from './goods-routing.module';
import { GoodsListComponent } from './goods-list/goods-list.component';
import { GoodsWriteComponent } from './goods-write/goods-write.component';

@NgModule({
  declarations: [
    GoodsListComponent,
    GoodsWriteComponent
  ],
  imports: [
    CommonModule,
    GoodsRoutingModule
  ]
})
export class GoodsModule { }
