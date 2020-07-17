import { last } from 'lodash-es';
import { first, map, scan, shareReplay,  } from 'rxjs/operators';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, GoodsService, } from '@app/core/http';
import { GoodsCacheService, PersistenceService } from '@app/core/persistence';
import { Goods } from '@app/core/model';
import { BehaviorSubject, combineLatest, forkJoin } from "rxjs";

@Component({
  selector: 'app-goods-list',
  templateUrl: './goods-list.component.html',
  styleUrls: ['./goods-list.component.scss']
})
export class GoodsListComponent implements OnInit {
  private fetchingMoreGoods = false;
  activatedRouterOutlet = false;
  activatedMoreGoods = true;

  moreGoodsList$ = new BehaviorSubject<Goods[]>([]);
  goodsList$ = combineLatest([
    this.persistenceService.goods$.pipe(first(), shareReplay(1)),
    this.moreGoodsList$.pipe(scan((a, c) => a.concat(c), []))
  ]).pipe(
    map(([goodsList, moreGoodsList]) => goodsList.concat(moreGoodsList)),
    shareReplay(1)
  )

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

  onMoreGoods() {
    if (this.fetchingMoreGoods || !this.activatedMoreGoods) {
      return;
    }

    this.fetchingMoreGoods = true;
    const groupId = this.activatedRoute.snapshot.paramMap.get('groupId');

    this.goodsList$.pipe(first()).subscribe((goodsList) => {
      this.goodsService.getQueryByGroupId(groupId, {
        startAfter: last(goodsList).updated,
        limit: 5
      }).subscribe(goodsList => {
        if (goodsList.length > 0) {
          this.moreGoodsList$.next(goodsList);
        } else {
          this.activatedMoreGoods = false;
        }
        this.fetchingMoreGoods = false;
      });
    });
  }

}
