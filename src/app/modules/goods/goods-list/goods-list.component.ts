import { last } from 'lodash-es';
import { filter, first, map, pairwise, scan, shareReplay, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService, GoodsService, } from '@app/core/http';
import { PersistenceService } from '@app/core/persistence';
import { BehaviorSubject, combineLatest, concat, forkJoin, merge, Observable, of, Subject } from "rxjs";
import { Goods } from "@app/core/model";

@Component({
  selector: 'app-goods-list',
  templateUrl: './goods-list.component.html',
  styleUrls: ['./goods-list.component.scss']
})
export class GoodsListComponent implements OnInit {
  private lastGoods: Goods;
  goodsList$: Observable<Goods[]>;

  private g1$ =
  private g2$ = forkJoin([
    this.authService.profile$.pipe(first(), filter(p => !!p), map(p => p.groupId)),
    this.more$
  ]).pipe(
    tap(t => console.log('m', t)),
    switchMap(([groupId, startAfter]) => {
      if (startAfter) {
        return this.goodsService.getQueryByGroupId(groupId, {startAfter, limit: 5});
      } else {
        return of([]);
      }
    })
  ).subscribe(p => console.log('rrr', p));



  // goodsList$ = this.persistenceService.goods$.pipe(
  //   first(),
  //   map(goodsList => goodsList.map(goods => ({
  //     ...goods,
  //     images: goods.images.slice(0, 2)
  //   }))),
  //   tap(goodsList => this.lastGoods = last(goodsList))
  // );

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private goodsService: GoodsService,
    private persistenceService: PersistenceService,
  ) {
    // this.persistenceService.goods$.pipe(first()).subscribe(
    //
    // )
  }

  ngOnInit(): void {
  }

  onClickMore() {
    this.goodsList$.pipe(first()).subscribe(goodsList => this.more$.next(last(goodsList).id));
    // const extras = {
    //   relativeTo: this.activatedRoute,
    //   queryParams: {
    //     limit: 10
    //   }
    // };
    // this.router.navigate(['./'], extras);
    // this.goodsList$ = this.authService.profile$.pipe(
    //   first(),
    //   filter(p => !!p),
    //   switchMap(profile => {
    //     const startAfter = this.lastGoods.id;
    //     return forkJoin([
    //       this.goodsList$,
    //       this.goodsService.getQueryByGroupId(profile.groupId, { startAfter, limit: 5 })
    //     ])
    //   }),
    //   map(([goodsList1, goodsList2]) => goodsList1.concat(goodsList2)),
    //   tap(goodsList => this.lastGoods = last(goodsList))
    // )
  }

}
