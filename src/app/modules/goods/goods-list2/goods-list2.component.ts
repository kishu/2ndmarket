import { last } from 'lodash-es';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { filter, first, map, scan, shareReplay, switchMap, tap } from 'rxjs/operators';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ActivationEnd, NavigationStart, Router, RouterEvent } from '@angular/router';
import { AuthService, GoodsService } from '@app/core/http';
import { GoodsCacheService, PersistenceService } from '@app/core/persistence';
import { GoodsListItemUpdateService } from '../services/goods-list-item-update.service';
import { Goods } from '@app/core/model';

@Component({
  selector: 'app-goods-list2',
  templateUrl: './goods-list2.component.html',
  styleUrls: ['./goods-list2.component.scss']
})
export class GoodsList2Component implements OnInit, OnDestroy {
  private fetchingMoreGoods = false;
  activatedRouterOutlet = false;
  updatedGoods$ = this.goodsListItemUpdateService.updatedGoods$.pipe(tap(g => console.log('update2', g)));
  moreGoods$ = new BehaviorSubject<Goods[]>([]);
  goods$ =
    combineLatest([
      this.persistenceService.goods$.pipe(first()),
      this.moreGoods$.pipe(scan((a, c) => a.concat(c), []))
    ]).pipe(
      map(([goods, moreGoods]) => goods.concat(moreGoods)),
      shareReplay(1)
    );
  private routerEventSubscription =
    this.router.events.pipe(
      // filter(e => e instanceof ActivationEnd)
    ).subscribe((e: any)  => {
      // console.log('############## e', e);
      // this.activatedRouterOutlet = e.snapshot.routeConfig.path !== 'goods'
      // this.changeDetectorRef.detectChanges();
    });

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private goodsService: GoodsService,
    private goodsCacheService: GoodsCacheService,
    private goodsListItemUpdateService: GoodsListItemUpdateService,
    private persistenceService: PersistenceService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.routerEventSubscription.unsubscribe();
    this.moreGoods$.unsubscribe();
  }

  trackBy(index, item) {
    return item.id;
  }

  onActivatedRouterOutlet(e) {
    console.log('+++onActivatedRouterOutlet', e);
    this.activatedRouterOutlet = true;
  }

  onDeactivatedRouterOutlet(e) {
    console.log('---onDeactivatedRouterOutlet', e);
    this.activatedRouterOutlet = false;
  }

  onClickGoods(e: Event, goods: Goods) {
    e.preventDefault();
    this.goodsCacheService.cache(goods);
  }

  onMoreGoods() {
    return false;
    if (this.fetchingMoreGoods || this.moreGoods$.closed) {
      return;
    }
    this.fetchingMoreGoods = true;
    combineLatest([
      this.goods$.pipe(first()),
      this.authService.profile$.pipe(first())
    ]).pipe(
      switchMap(([goods, profile]) => {
        return this.goodsService.getQueryByGroupId(profile.groupId, {
          startAfter: last(goods).updated,
          limit: 5
        });
      })
    ).subscribe(moreGoods => {
      if (moreGoods.length > 0) {
        this.moreGoods$.next(moreGoods);
      } else {
        this.moreGoods$.unsubscribe();
      }
      this.fetchingMoreGoods = false;
    });
  }

}
