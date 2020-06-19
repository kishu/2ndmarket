import { Injectable } from '@angular/core';
import { Goods } from "@app/core/model";

@Injectable({
  providedIn: 'root'
})
export class GoodsCacheService {
  private goods: Goods;

  constructor() { }

  setGoods(goods: Goods) {
    this.goods = goods;
  }

  getGoods(goodsId: string): Goods | null {
    return this.goods?.id === goodsId ? this.goods : null;
  }

  removeGoods() {
    this.goods = null;
  }

}
