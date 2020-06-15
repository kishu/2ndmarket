import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { canActivate, redirectUnauthorizedTo } from "@angular/fire/auth-guard";
import { GoodsListComponent } from './goods-list/goods-list.component';
import { GoodsWriteComponent } from './goods-write/goods-write.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['sign-in']);

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'goods', component: GoodsListComponent },
      { path: 'goods/write', component: GoodsWriteComponent, ...canActivate(redirectUnauthorizedToLogin) },
    ])
  ],
  exports: [RouterModule]
})
export class GoodsRoutingModule { }
