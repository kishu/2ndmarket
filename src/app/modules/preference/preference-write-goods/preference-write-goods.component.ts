import { Component, OnInit } from '@angular/core';
import { GoodsCacheService, PersistenceService } from '@app/core/persistence';
import { Goods } from "@app/core/model";

@Component({
  selector: 'app-preference-write-goods, [app-preference-write-goods]',
  templateUrl: './preference-write-goods.component.html',
  styleUrls: ['./preference-write-goods.component.scss']
})
export class PreferenceWriteGoodsComponent implements OnInit {
  goodsList$ = this.persistenceService.writeGoods$;

  constructor(
    private goodsCacheService: GoodsCacheService,
    private persistenceService: PersistenceService
  ) {
  }

  ngOnInit(): void {
  }

  onClickGoods(e: Event, goods: Goods) {
    e.preventDefault();
    this.goodsCacheService.cache(goods);
  }
}
