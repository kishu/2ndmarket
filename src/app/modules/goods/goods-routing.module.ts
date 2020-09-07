import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CanActivateGoodsGuard } from './can-activate-goods.guard';
import { GoodsDetailComponent } from './goods-detail/goods-detail.component';
import { GoodsEditComponent } from './goods-edit/goods-edit.component';
import { GoodsListComponent } from './goods-list/goods-list.component';
import { GoodsSearchListComponent } from './goods-search-list/goods-search-list.component';
import { GoodsWriteComponent } from './goods-write/goods-write.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'goods/new/edit',
        component: GoodsWriteComponent,
      },
      {
        path: 'goods',
        component: GoodsListComponent
      },
      {
        path: 'goods/search',
        component: GoodsSearchListComponent
      },
      {
        path: 'goods/:goodsId/new',
        component: GoodsDetailComponent
      },
      {
        path: 'goods/:goodsId',
        component: GoodsDetailComponent
      },
      {
        path: 'goods/:goodsId/edit',
        component: GoodsEditComponent,
        canActivate: [ CanActivateGoodsGuard ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class GoodsRoutingModule { }
