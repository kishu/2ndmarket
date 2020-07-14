import { Injectable } from '@angular/core';
import { Goods } from "@app/core/model";
import { merge, Observable, of } from "rxjs";
import { GoodsService } from "@app/core/http";

@Injectable({
  providedIn: 'root'
})
export class GoodsCacheService {
  private cachedGoods: Goods;

  constructor(
    private goodsService: GoodsService
  ) { }

  cache(goods: Goods) {
    this.cachedGoods = goods;
  }

  getCachedGoods$(goodsId: string): Observable<Goods> {
    if (goodsId === this.cachedGoods.id) {
      return merge(
        of(this.cachedGoods),
        this.goodsService.valueChanges(this.cachedGoods.id)
      )
    } else {
      return this.goodsService.valueChanges(goodsId);
    }
  }


}
