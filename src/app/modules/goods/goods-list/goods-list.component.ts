import { last } from 'lodash-es';
import { forkJoin, ReplaySubject } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AuthService, GoodsService } from '@app/core/http';
import { GoodsCacheService, PersistenceService } from '@app/core/persistence';
import { Goods } from '@app/core/model';

@Component({
  selector: 'app-goods-list',
  templateUrl: './goods-list.component.html',
  styleUrls: ['./goods-list.component.scss']
})
export class GoodsListComponent implements OnInit, OnDestroy {
  goods$ = new ReplaySubject<Goods[]>(1);
  more = false;

  get tag() {
    return this.activatedRoute.snapshot.queryParamMap.get('tag');
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private goodsService: GoodsService,
    private goodsCacheService: GoodsCacheService,
    private persistenceService: PersistenceService,
  ) {
    this.activatedRoute.queryParamMap.pipe(
      map(m => m.get('tag')?.trim())
    ).subscribe(keyword => {
      keyword ? this.searchGoods(keyword) : this.initGoods();
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.goods$.complete();
  }

  trackBy(index, item) {
    return item.id;
  }

  initGoods() {
    this.persistenceService.goods$.pipe(first()).subscribe(g => {
      this.more = g.length >= 5;
      this.goods$.next(g);
    });
  }

  searchGoods(keyword: string) {
    this.authService.profileExt$.pipe(
      first(),
      switchMap(p => this.goodsService.getQueryByGroupIdAndTag(p.groupId, keyword, { limit: 5 }))
    ).subscribe(g => {
      this.more = g.length >= 5;
      this.goods$.next(g);
    });
  }

  onMoreGoods() {
    if (!this.more) {
      return;
    }

    forkJoin([
      this.authService.profileExt$.pipe(first()),
      this.goods$.pipe(first())
    ]).pipe(
      switchMap(([p, g]) => {
        const tag = this.activatedRoute.snapshot.queryParamMap.get('tag')?.trim();
        const options = {startAfter: last(g).updated, limit: 5};
        const more$ = tag ?
          this.goodsService.getQueryByGroupIdAndTag(p.groupId, tag, options) :
          this.goodsService.getQueryByGroupId(p.groupId, options);
        return more$.pipe(
          first(),
          tap(moreGoods => this.more = moreGoods.length >= 5),
          map(moreGoods => g.concat(moreGoods))
        );
      })
    ).subscribe(g => this.goods$.next(g));
  }

}
