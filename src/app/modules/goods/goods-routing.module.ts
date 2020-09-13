import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { GoodsDetailComponent } from './goods-detail/goods-detail.component';
import { GoodsEditComponent } from './goods-edit/goods-edit.component';
import { GoodsListComponent } from './goods-list/goods-list.component';
import { GoodsSearchListComponent } from './goods-search-list/goods-search-list.component';
import { GoodsWriteComponent } from './goods-write/goods-write.component';

const redirectUnauthorizedToSignIn = () => redirectUnauthorizedTo(['/auth/sign-in']);

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'goods',
        component: GoodsListComponent,
        ...canActivate(redirectUnauthorizedToSignIn)
      },
      {
        path: 'goods/new/edit',
        component: GoodsWriteComponent,
        ...canActivate(redirectUnauthorizedToSignIn)
      },
      {
        path: 'goods/search',
        component: GoodsSearchListComponent,
        ...canActivate(redirectUnauthorizedToSignIn)
      },
      {
        path: 'goods/:goodsId/new',
        component: GoodsDetailComponent,
        ...canActivate(redirectUnauthorizedToSignIn)
      },
      {
        path: 'goods/:goodsId',
        component: GoodsDetailComponent,
        ...canActivate(redirectUnauthorizedToSignIn)
      },
      {
        path: 'goods/:goodsId/edit',
        component: GoodsEditComponent,
        ...canActivate(redirectUnauthorizedToSignIn)
      }
    ])
  ],
  exports: [RouterModule]
})
export class GoodsRoutingModule { }
