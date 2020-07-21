import { last } from 'lodash-es';
import { first, map, scan, shareReplay, skip, switchMap, tap, } from 'rxjs/operators';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, GoodsService, } from '@app/core/http';
import { GoodsCacheService, PersistenceService } from '@app/core/persistence';
import { Goods } from '@app/core/model';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { DocumentChangeAction } from '@angular/fire/firestore';

@Component({
  selector: 'app-goods-list',
  templateUrl: './goods-list.component.html',
  styleUrls: ['./goods-list.component.scss']
})
export class GoodsListComponent implements OnInit, OnDestroy {
  private fetchingMoreGoods = false;
  activatedRouterOutlet = false;
  activatedMoreGoods = true;

  moreGoods$ = new BehaviorSubject<Goods[]>([]);
  goods$ = combineLatest([
    this.persistenceService.goods$.pipe(first()),
    this.moreGoods$.pipe(scan((a, c) => a.concat(c), []))
  ]).pipe(
    map(([goods, moreGoods]) => goods.concat(moreGoods)),
    shareReplay(1)
  );

  goodsStateChanges: DocumentChangeAction<any>[];
  goodsStateChangeSubscription = this.goods$.pipe(
    switchMap(goods => {
      return this.goodsService
        .stateChangesQueryByGroupId(
          this.groupId, {
            startAfter: goods[0].updated,
            limit: goods.length
          }
        );
    })
  ).subscribe(actions => {
    this.goodsStateChanges = actions;
  });

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
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.goodsStateChangeSubscription.unsubscribe();
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

  onMoreGoods() {
    if (this.fetchingMoreGoods || !this.activatedMoreGoods) {
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
          this.activatedMoreGoods = false;
        }
        this.fetchingMoreGoods = false;
      });
    });
  }

}
