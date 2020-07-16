import { last } from 'lodash-es';
import { first, scan, shareReplay, tap } from 'rxjs/operators';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, GoodsService, } from '@app/core/http';
import { GoodsCacheService, PersistenceService } from '@app/core/persistence';
import { Goods } from '@app/core/model';

@Component({
  selector: 'app-goods-list',
  templateUrl: './goods-list.component.html',
  styleUrls: ['./goods-list.component.scss']
})
export class GoodsListComponent implements OnInit {
  private fetchingMoreGoods = false;
  activatedRouterOutlet = false;
  activatedGoodsMore = true;
  goodsList$ = this.persistenceService.goods$.pipe(
    tap(g => console.log('asdfasdf', g)),
    tap(() => this.fetchingMoreGoods = false),
    tap((goodsList) => {
      this.persistenceService.moreGoods$.pipe(first()).subscribe(({ limit }) => {
        this.activatedGoodsMore = limit === goodsList.length;
      });
    }),
    shareReplay(1)
  );

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private goodsService: GoodsService,
    private goodsCacheService: GoodsCacheService,
    private persistenceService: PersistenceService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
  }

  trackBy(index, item) {
    return item.id;
  }

  onActivatedRouterOutlet() {
    this.activatedRouterOutlet = true;
    this.changeDetectorRef.detectChanges();
  }

  onDeactivatedRouterOutlet() {
    this.activatedRouterOutlet = false;
    this.changeDetectorRef.detectChanges();
  }

  onClickGoods(e: Event, goods: Goods) {
    e.preventDefault();
    this.goodsCacheService.cache(goods);
  }

  onGoodsMore() {
    console.log('onGoodsMore');
    if (this.fetchingMoreGoods || !this.activatedGoodsMore) {
      return;
    }

    this.fetchingMoreGoods = true;
    this.goodsList$.pipe(first()).subscribe(goodsList => {
      this.persistenceService.moreGoods$.next({ limit: goodsList.length + 5 });
    });
  }

}
