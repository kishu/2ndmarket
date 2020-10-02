import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GoodsCacheService, Persistence2Service } from '@app/core/persistence';
import { Goods } from '@app/core/model';

@Component({
  selector: 'app-preference-written-goods, [app-preference-written-goods]',
  templateUrl: './preference-written-goods.component.html',
  styleUrls: ['./preference-written-goods.component.scss']
})
export class PreferenceWrittenGoodsComponent implements OnInit {
  goodsList$ = this.persistenceService.writtenGoods$;

  constructor(
    private location: Location,
    private goodsCacheService: GoodsCacheService,
    private persistenceService: Persistence2Service
  ) {
  }

  ngOnInit(): void {
  }

  onClickGoods(e: Event, goods: Goods) {
    e.preventDefault();
    this.goodsCacheService.cache(goods);
  }

  onClickHistoryBack() {
    this.location.back();
  }
}
