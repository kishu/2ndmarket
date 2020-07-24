import { Subscription } from 'rxjs';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GoodsService } from '@app/core/http';
import { GoodsCacheService } from '@app/core/persistence';
import { Goods } from '@app/core/model';

@Component({
  selector: 'app-goods-list-item',
  templateUrl: './goods-list-item.component.html',
  styleUrls: ['./goods-list-item.component.scss']
})
export class GoodsListItemComponent implements OnInit, OnDestroy {
  displayGoods: Goods;
  exists = true;
  protected goodsSnapshotChangeSubscription: Subscription;
  @Input() set goods(goods: Goods) {
    this.displayGoods = goods;
    this.goodsSnapshotChangeSubscription =
      this.goodsService.snapshotChanges(goods.id).subscribe(action => {
        if (action.payload.exists) {
          this.displayGoods = { id: action.payload.id, ...action.payload.data() };
        } else {
          this.exists = false;
        }
      });
  }

  constructor(
    private goodsService: GoodsService,
    private goodsCacheService: GoodsCacheService,
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.goodsSnapshotChangeSubscription.unsubscribe();
  }

  onClickGoods(e: Event, goods: Goods) {
    if (this.exists) {
      e.preventDefault();
      this.goodsCacheService.cache(goods);
    }
  }

}
