import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { GoodsListComponent } from './goods-list/goods-list.component';
import { GoodsDetailComponent } from "@app/modules/goods/goods-detail/goods-detail.component";
import { GoodsWriteComponent } from './goods-write/goods-write.component';
import { GoodsWrite2Component } from './goods-write2/goods-write2.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['sign-in']);

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'goods',
        component: GoodsListComponent,
        children: [
          { path: ':goodsId', component: GoodsDetailComponent }
        ]
      },
      // when use guard, reactive form nested goods-write-component is not working
      { path: 'goods/write2', component: GoodsWrite2Component, /* ...canActivate(redirectUnauthorizedToLogin) */ },
      { path: 'goods/write', component: GoodsWriteComponent, ...canActivate(redirectUnauthorizedToLogin) },
    ])
  ],
  exports: [RouterModule]
})
export class GoodsRoutingModule { }
