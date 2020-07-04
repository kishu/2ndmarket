import { Injectable } from '@angular/core';
import { Goods } from '@app/core/model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoodsListCacheService {
  private cachedGoodsList: Goods[];
  constructor() { }

  set(goodsList: Goods[]) {
    console.log('set cache');
    this.cachedGoodsList = goodsList;
  }

  get() {
    console.log('Get cache');
    return of(this.cachedGoodsList);
  }

  hasCachedData() {
    return !!this.cachedGoodsList;
  }

  clear() {
    this.cachedGoodsList = null;
  }
}
