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
        ...canActivate(redirectUnauthorizedToSignIn),
        children: [
          {
            path: '',
            component: GoodsListComponent,
          },
          {
            path: 'new/edit',
            component: GoodsWriteComponent,
          },
          {
            path: 'search',
            component: GoodsSearchListComponent,
          },
          {
            path: ':goodsId/new',
            component: GoodsDetailComponent,
          },
          {
            path: ':goodsId',
            component: GoodsDetailComponent
          },
          {
            path: ':goodsId/edit',
            component: GoodsEditComponent
          }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class GoodsRoutingModule { }
