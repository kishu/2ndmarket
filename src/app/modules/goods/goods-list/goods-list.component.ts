import { map, shareReplay } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, GoodsService, } from '@app/core/http';
import { PersistenceService } from '@app/core/persistence';

@Component({
  selector: 'app-goods-list',
  templateUrl: './goods-list.component.html',
  styleUrls: ['./goods-list.component.scss']
})
export class GoodsListComponent implements OnInit {
  goodsList$ = this.persistenceService.goods$.pipe(
    map(goodsList => goodsList.map(goods => ({
      ...goods,
      images: goods.images.slice(0, 2)
    })))
  );

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private goodsService: GoodsService,
    private persistenceService: PersistenceService
  ) {
  }

  ngOnInit(): void {
  }

}
