import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GoodsListComponent } from './goods-list/goods-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'goods', component: GoodsListComponent },
    ])
  ],
  exports: [RouterModule]
})
export class GoodsRoutingModule { }
