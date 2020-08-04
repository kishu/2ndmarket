import { last } from 'lodash-es';
import { BehaviorSubject, combineLatest, forkJoin, Subject } from 'rxjs';
import { first, map, scan, switchMap } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, GoodsService } from '@app/core/http';
import { GoodsCacheService, PersistenceService } from '@app/core/persistence';
import { Goods } from '@app/core/model';

@Component({
  selector: 'app-goods-list',
  templateUrl: './goods-list.component.html',
  styleUrls: ['./goods-list.component.scss']
})
export class GoodsListComponent implements OnInit, OnDestroy {
  moreGoods$ = new BehaviorSubject<Goods[]>([]);

  goods$ = combineLatest([
    this.persistenceService.goods$.pipe(first()),
    this.moreGoods$.pipe(scan((acc, curr) => acc.concat(curr), []))
  ]).pipe(
    map(([goods, moreGoods]) => goods.concat(moreGoods))
  );

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private goodsService: GoodsService,
    private goodsCacheService: GoodsCacheService,
    private persistenceService: PersistenceService
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.moreGoods$.complete();
  }

  trackBy(index, item) {
    return item.id;
  }

  onMoreGoods() {
    if (this.moreGoods$.isStopped) {
      return;
    }

    forkJoin([
      this.authService.profileExt$.pipe(first()),
      this.goods$.pipe(first(), map(goods => last(goods)))
    ]).pipe(
      switchMap(([p, g]) => {
        return this.goodsService.getQueryByGroupId(p.groupId, {
          startAfter: g.updated,
          limit: 5
        });
      })
    ).subscribe(moreGoods => {
      if (moreGoods.length > 0) {
        this.moreGoods$.next(moreGoods);
      } else {
        this.moreGoods$.complete();
      }
    });
  }

}
