import { last } from 'lodash-es';
import { BehaviorSubject, combineLatest } from "rxjs";
import { first, map, scan, shareReplay } from "rxjs/operators";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService, GoodsService } from "@app/core/http";
import { GoodsCacheService, PersistenceService } from "@app/core/persistence";
import { Goods } from "@app/core/model";

@Component({
  selector: 'app-goods-list2',
  templateUrl: './goods-list2.component.html',
  styleUrls: ['./goods-list2.component.scss']
})
export class GoodsList2Component implements OnInit, OnDestroy {
  private fetchingMoreGoods = false;
  activatedRouterOutlet = false;
  moreGoods$ = new BehaviorSubject<Goods[]>([]);
  goods$ = combineLatest([
    this.persistenceService.goods$.pipe(first()),
    this.moreGoods$.pipe(scan((a, c) => a.concat(c),[]))
  ]).pipe(
    map(([goods, moreGoods]) => goods.concat(moreGoods)),
    shareReplay(1)
  )

  get groupId() {
    return this.activatedRoute.snapshot.paramMap.get('groupId');
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private goodsService: GoodsService,
    private goodsCacheService: GoodsCacheService,
    private persistenceService: PersistenceService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    console.log('closed', this.moreGoods$.closed);
  }

  ngOnDestroy() {
    this.moreGoods$.unsubscribe();
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

  onMoreGoods() {
    if (this.fetchingMoreGoods || this.moreGoods$.closed) {
      return;
    }

    this.fetchingMoreGoods = true;
    const groupId = this.activatedRoute.snapshot.paramMap.get('groupId');
    this.goods$.pipe(first()).subscribe((goods) => {
      this.goodsService.getQueryByGroupId(groupId, {
        startAfter: last(goods).updated,
        limit: 5
      }).subscribe(moreGoods => {
        if (moreGoods.length > 0) {
          this.moreGoods$.next(moreGoods);
        } else {
          this.moreGoods$.unsubscribe();
        }
        this.fetchingMoreGoods = false;
      });
    });
  }

}
