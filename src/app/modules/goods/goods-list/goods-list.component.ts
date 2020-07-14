import { last } from 'lodash-es';
import { BehaviorSubject, combineLatest, forkJoin } from "rxjs";
import { filter, first, map, scan, shareReplay, switchMap } from 'rxjs/operators';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, GoodsService, } from '@app/core/http';
import { GoodsCacheService, PersistenceService } from '@app/core/persistence';
import { Goods } from "@app/core/model";

@Component({
  selector: 'app-goods-list',
  templateUrl: './goods-list.component.html',
  styleUrls: ['./goods-list.component.scss']
})
export class GoodsListComponent implements OnInit {
  activatedRouterOutlet = false;
  moreGoods$ = new BehaviorSubject<Goods[] | null>([]);
  goodsList$ = combineLatest([
    this.persistenceService.goods$.pipe(first(), shareReplay(1)),
    this.moreGoods$.pipe(filter(goods => goods !== null), scan((acc, curr) => acc.concat(curr)))
  ]).pipe(
    map(([persistenceGoods, moreGoods]) => persistenceGoods.concat(moreGoods)),
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

  onClickMore() {
    forkJoin([
      this.authService.profile$.pipe(first(), filter(p => !!p)),
      this.goodsList$.pipe(first())
    ]).pipe(
      switchMap(([profile, goodsList]) => {
        const startAfter = last(goodsList).updated;
        return this.goodsService.getQueryByGroupId(profile.groupId, { startAfter, limit: 5 })
      })
    ).subscribe(goodsList => {
      if (goodsList.length > 0) {
        this.moreGoods$.next(goodsList);
      } else {
        this.moreGoods$.next(null);
      }
    });
  }

}
