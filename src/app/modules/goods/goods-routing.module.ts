import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { PermitGoodsGuard } from './permit-goods.guard';
import { GoodsListComponent } from './goods-list/goods-list.component';
import { GoodsDetailComponent } from './goods-detail/goods-detail.component';
import { GoodsWriteComponent } from './goods-write/goods-write.component';
import { GoodsEditComponent } from './goods-edit/goods-edit.component';
const redirectUnauthorizedToSignIn = () => redirectUnauthorizedTo(['sign-in']);

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'goods/new/edit',
        component: GoodsWriteComponent,
        ...canActivate(redirectUnauthorizedToSignIn)
      },
      { path: 'goods', component: GoodsListComponent },
      { path: 'goods/:goodsId', component: GoodsDetailComponent },
      {
        path: 'goods/:goodsId/edit',
        component: GoodsEditComponent,
        canActivate: [ PermitGoodsGuard ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class GoodsRoutingModule { }
