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

  searchForm = this.fb.group({
    keyword: [],
  });

  goods$ = new ReplaySubject<Goods[]>(1);
  private keyword: string;
  more = false;

  get keywordCtl() {
    return this.searchForm.get('keyword');
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private goodsService: GoodsService,
    private goodsCacheService: GoodsCacheService,
    private persistenceService: PersistenceService
  ) {
    this.initGoods();
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

  onClickCancelSearch() {
    this.keywordCtl.reset();
    this.keyword = '';
    this.initGoods();
  }

  onSubmitSearch() {
    this.searchForm.disable();
    this.keyword = this.keywordCtl.value;
    this.authService.profileExt$.pipe(
      first(),
      switchMap(p => this.goodsService.getQueryByGroupIdAndTag(p.groupId, this.keyword, { limit: 5 }))
    ).subscribe(g => {
      this.more = g.length >= 5;
      this.goods$.next(g);
      this.searchForm.enable();
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
        const options = {startAfter: last(g).updated, limit: 5};
        const more$ = this.keyword ?
          this.goodsService.getQueryByGroupIdAndTag(p.groupId, this.keyword, options) :
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
