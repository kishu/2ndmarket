import { BehaviorSubject, of } from 'rxjs';
import { filter, first, map, shareReplay, switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AuthService, GoodsFavoritesService, GoodsService, NoticesService } from '@app/core/http';
import { Notice } from '@app/core/model';

@Component({
  selector: 'app-preference-favorite-goods, [app-preference-favorite-goods]',
  templateUrl: './preference-favorite-goods.component.html',
  styleUrls: ['./preference-favorite-goods.component.scss']
})
export class PreferenceFavoriteGoodsComponent implements OnInit {
  profile$ = this.authService.profile$.pipe(first(), filter(p => !!p), shareReplay());
  favoriteGoodsList$ = this.profile$.pipe(
    switchMap(p => this.goodsFavoriteService.getQueryByProfileId(p.id))
  );

  constructor(
    private authService: AuthService,
    private goodsService: GoodsService,
    private goodsFavoriteService: GoodsFavoritesService,
    private noticesService: NoticesService,
  ) {
  }

  ngOnInit(): void {
  }

  trackById(index, item) {
    return item.id;
  }
}
