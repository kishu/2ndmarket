import { forkJoin, Observable, of, zip } from 'rxjs';
import { concatAll, first, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
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
  user$ = this.authService.user$.pipe(first());
  goods$: Observable<Goods>;
  canEdit = false;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private goodsService: GoodsService,
    private goodsCacheService: GoodsCacheService
  ) {
    const goodsId = this.activatedRoute.snapshot.paramMap.get('goodsId');

    this.goods$ = zip(
      this.user$.pipe(first()),
      this.goodsCacheService.getGoods(goodsId).pipe(switchMap(g => g ? of(g) : this.goodsService.get(goodsId).pipe(first())))
    ).pipe(
      tap(([u, g]) => this.canEdit = g.userId === u.id),
      map(([, g]) => g)
    );
  }

  ngOnInit(): void {
  }

}
