import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GoodsListComponent } from './goods-list/goods-list.component';
import { GoodsWriteComponent } from './goods-write/goods-write.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'goods', component: GoodsListComponent },
      { path: 'goods/write', component: GoodsWriteComponent },
    ])
  ],
  exports: [RouterModule]
})
export class GoodsRoutingModule { }
