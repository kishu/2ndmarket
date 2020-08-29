import { last } from 'lodash-es';
import { forkJoin, ReplaySubject } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService, GoodsService } from '@app/core/http';
import { PersistenceService } from '@app/core/persistence';
import { Goods } from '@app/core/model';

@Component({
  selector: 'app-goods-list',
  templateUrl: './goods-list.component.html',
  styleUrls: ['./goods-list.component.scss']
})
export class GoodsListComponent implements OnInit, OnDestroy {
  goods$ = new ReplaySubject<Goods[]>(1);
  more = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private goodsService: GoodsService,
    private persistenceService: PersistenceService,
  ) {
    this.persistenceService.goods$.pipe(first()).subscribe(g => {
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
        const options = {startAfter: last(g).updated, limit: 5};
        return this.goodsService.getQueryByGroupId(p.groupId, options).pipe(
          first(),
          tap(moreGoods => this.more = moreGoods.length >= 5),
          map(moreGoods => g.concat(moreGoods))
        );
      })
    ).subscribe(g => this.goods$.next(g));
  }

}
