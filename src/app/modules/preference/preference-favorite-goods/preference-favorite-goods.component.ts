import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/http';
import { GoodsCacheService, PersistenceService } from '@app/core/persistence';
import { Goods } from '@app/core/model';

@Component({
  selector: 'app-preference-favorite-goods, [app-preference-favorite-goods]',
  templateUrl: './preference-favorite-goods.component.html',
  styleUrls: ['./preference-favorite-goods.component.scss']
})
export class PreferenceFavoriteGoodsComponent implements OnInit {
  goodsList$ = this.persistenceService.favoriteGoods$;

  constructor(
    private location: Location,
    private authService: AuthService,
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

  onClickHistoryBack() {
    this.location.back();
  }

}
