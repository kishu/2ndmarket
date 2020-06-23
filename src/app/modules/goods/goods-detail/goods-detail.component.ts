import { combineLatest, forkJoin, Observable, of, zip } from 'rxjs';
import { concatAll, filter, first, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, GoodsService, GoodsCacheService } from '@app/core/http';
import { Goods, User } from '@app/core/model';

@Component({
  selector: 'app-goods-detail',
  templateUrl: './goods-detail.component.html',
  styleUrls: ['./goods-detail.component.scss']
})
export class GoodsDetailComponent implements OnInit {
  private goodsId = this.activatedRoute.snapshot.paramMap.get('goodsId');
  user$ = this.authService.user$.pipe(first());
  goods$ = forkJoin(
    this.user$,
    this.goodsCacheService.getGoods(this.goodsId).pipe(
      switchMap(g => g ?
        of(g) :
        this.goodsService.get(this.goodsId).pipe(first()))
    )
  ).pipe(
    tap(([u, g]) => this.canEdit = g.userId === u.id),
    map(([, g]) => g)
  );
  canEdit = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private goodsService: GoodsService,
    private goodsCacheService: GoodsCacheService
  ) {
  }

  ngOnInit(): void {
  }

  onClickFavorite() {
    this.authService.user$.pipe(
      first(),
      filter(u => !!u),
      // switchMap(u => this.)
    ).subscribe(r => console.log(r));
    // combineLatest(this.user$, this.goods$)
    // .pipe(
    //   filter(([u, ]) => !!u),
    //   switchMap(([u, g]) => {
    //
    //   })
    // )
    // .subscribe(r => console.log(r));
  }

}
