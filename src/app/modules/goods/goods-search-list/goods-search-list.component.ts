import { last } from 'lodash-es';
import { combineLatest, forkJoin, ReplaySubject } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService, GoodsService } from '@app/core/http';
import { Goods } from '@app/core/model';

@Component({
  selector: 'app-goods-search-list',
  templateUrl: './goods-search-list.component.html',
  styleUrls: ['./goods-search-list.component.scss']
})
export class GoodsSearchListComponent implements OnInit, OnDestroy {
  goods$ = new ReplaySubject<Goods[]>(1);
  more = false;

  get tag() {
    return this.activatedRoute.snapshot.queryParamMap.get('tag');
  }

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private goodsService: GoodsService
  ) {
    combineLatest([
      this.authService.profileExt$.pipe(first()),
      this.activatedRoute.queryParamMap.pipe(map(m => m.get('tag')?.trim())),
    ]).pipe(
      switchMap(([p, t]) => this.goodsService.getQueryByGroupIdAndTag(p.groupId, t, { limit: 5 }))
    ).subscribe(g => {
      this.more = g.length >= 5;
      this.goods$.next(g);
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
        return this.goodsService.getQueryByGroupIdAndTag(p.groupId, tag, options).pipe(
          first(),
          tap(moreGoods => this.more = moreGoods.length >= 5),
          map(moreGoods => g.concat(moreGoods))
        );
      })
    ).subscribe(g => this.goods$.next(g));
  }

  onClickHistoryBack() {
    this.location.back();
  }

}
