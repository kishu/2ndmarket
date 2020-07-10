import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/http';
import { PersistenceService } from '@app/core/persistence';

@Component({
  selector: 'app-preference-favorite-goods, [app-preference-favorite-goods]',
  templateUrl: './preference-favorite-goods.component.html',
  styleUrls: ['./preference-favorite-goods.component.scss']
})
export class PreferenceFavoriteGoodsComponent implements OnInit {
  goodsList$ = this.persistenceService.favoriteGoods$;

  constructor(
    private authService: AuthService,
    private persistenceService: PersistenceService
  ) {
  }

  ngOnInit(): void {
  }

}
