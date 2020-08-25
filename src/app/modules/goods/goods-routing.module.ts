import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CanActivateGoodsGuard } from './can-actuvate-goods-guard.service';
import { GoodsDetailComponent } from './goods-detail/goods-detail.component';
import { GoodsEditComponent } from './goods-edit/goods-edit.component';
import { GoodsListComponent } from './goods-list/goods-list.component';
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
