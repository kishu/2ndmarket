import { last } from 'lodash-es';
import { filter, first, map, scan, shareReplay, switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, GoodsService, } from '@app/core/http';
import { PersistenceService } from '@app/core/persistence';
import { BehaviorSubject, combineLatest, forkJoin } from "rxjs";
import { Goods } from "@app/core/model";

@Component({
  selector: 'app-goods-list',
  templateUrl: './goods-list.component.html',
  styleUrls: ['./goods-list.component.scss']
})
export class GoodsListComponent implements OnInit {
  moreGoods$ = new BehaviorSubject<Goods[] | null>([]);
  goodsList$ = combineLatest([
    this.persistenceService.goods$.pipe(first(), shareReplay(1)),
    this.moreGoods$.pipe(filter(goods => goods !== null), scan((acc, curr) => acc.concat(curr)))
  ]).pipe(
    map(([persistenceGoods, moreGoods]) => persistenceGoods.concat(moreGoods)),
    shareReplay(1)
  )

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private goodsService: GoodsService,
    private persistenceService: PersistenceService,
  ) {
  }

  ngOnInit(): void {
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
