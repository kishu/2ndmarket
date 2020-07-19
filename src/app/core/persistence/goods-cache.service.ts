import { Injectable } from '@angular/core';
import { Goods } from '@app/core/model';
import { merge, Observable, of } from 'rxjs';
import { GoodsService } from '@app/core/http';
import { tap } from 'rxjs/operators';

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

  remove() {
    this.cachedGoods = null;
  }

  getCachedGoods$(goodsId: string): Observable<Goods | null> {
    if (goodsId === this.cachedGoods?.id) {
      return of(this.cachedGoods);
    } else {
      return of(null);
    }
  }

}
