import { Subscription } from 'rxjs';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoodsService } from '@app/core/http';
import { GoodsCacheService } from '@app/core/persistence';
import { Goods } from '@app/core/model';

@Component({
  selector: 'app-goods-list-item',
  templateUrl: './goods-list-item.component.html',
  styleUrls: ['./goods-list-item.component.scss']
})
export class GoodsListItemComponent implements OnInit, OnDestroy {
  goods: Goods;
  exists = true;
  protected goodsSnapshotChangeSubscription: Subscription;
  @Input() set item(goods: Goods) {
    this.goods = goods;
  }

  get keyword() {
    return this.activatedRoute.snapshot.queryParamMap.get('tag');
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private goodsService: GoodsService,
    private goodsCacheService: GoodsCacheService,
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.goodsSnapshotChangeSubscription?.unsubscribe();
  }

  onClickGoods(e: Event, goods: Goods) {
    if (this.exists) {
      e.preventDefault();
      this.goodsCacheService.cache(goods);
      if (!this.goodsSnapshotChangeSubscription) {
        this.goodsSnapshotChangeSubscription =
          this.goodsService.snapshotChanges(goods.id).subscribe(action => {
            if (action.payload.exists) {
              this.goods = {id: action.payload.id, ...action.payload.data()};
            } else {
              this.exists = false;
            }
          });
      }
    }
  }

}
