import { last } from 'lodash-es';
import { BehaviorSubject, combineLatest, concat, forkJoin, merge, Observable, of, Subject } from 'rxjs';
import { first, map, scan, shareReplay, skip, switchMap, takeUntil, tap } from 'rxjs/operators';
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
  private fetching = false;
  private destroy$ = new Subject<null>();
  moreGoods$ = new BehaviorSubject<Goods[]>([]);

  goods$ = concat(
    this.persistenceService.goods$.pipe(first()),
    this.authService.profileExt$.pipe(
      switchMap(() => this.persistenceService.goods$.pipe(skip(1), first())),
    )
  ).pipe(
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
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackBy(index, item) {
    return item.id;
  }

  onMoreGoods() {
    // if (this.fetching || this.moreGoods$.closed) {
    //   return;
    // }
    // this.fetching = true;
    //
    // forkJoin([
    //   this.authService.profileExt$.pipe(first()),
    //   this.goods$.pipe(first(), map(goods => last(goods)))
    // ]).pipe(
    //   switchMap(([p, g]) => {
    //     return this.goodsService.getQueryByGroupId(p.groupId, {
    //       startAfter: g.updated,
    //       limit: 5
    //     });
    //   })
    // ).subscribe(moreGoods => {
    //   if (moreGoods.length > 0) {
    //     this.moreGoods$.next(moreGoods);
    //   } else {
    //     this.moreGoods$.unsubscribe();
    //   }
    //   this.fetching = false;
    // });
  }

}
