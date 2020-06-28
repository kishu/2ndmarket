import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { GoodsListComponent } from './goods-list/goods-list.component';
import { GoodsDetailComponent } from './goods-detail/goods-detail.component';
import { GoodsWriteComponent } from './goods-write/goods-write.component';
import { GoodsEditComponent } from './goods-edit/goods-edit.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['sign-in']);

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'goods', component: GoodsListComponent, data: { reuse: true } },
      // when use guard, reactive form nested goods-write-component is not working
      { path: 'goods/new/edit', component: GoodsWriteComponent, /* ...canActivate(redirectUnauthorizedToLogin) */ },
      { path: 'goods/:goodsId', component: GoodsDetailComponent },
      { path: 'goods/:goodsId/edit', component: GoodsEditComponent }
    ])
  ],
  exports: [RouterModule]
})
export class GoodsRoutingModule { }
