import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/http';
import { GoodsCacheService, Persistence2Service } from '@app/core/persistence';
import { Goods } from '@app/core/model';

@Component({
  selector: 'app-preference-favorited-goods, [app-preference-favorited-goods]',
  templateUrl: './preference-favorited-goods.component.html',
  styleUrls: ['./preference-favorited-goods.component.scss']
})
export class PreferenceFavoritedGoodsComponent implements OnInit {
  goodsList$ = this.persistenceService.favoritedGoods$;

  constructor(
    private location: Location,
    private authService: AuthService,
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
