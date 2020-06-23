import { forkJoin, of } from 'rxjs';
import { filter, first, map, switchMap, tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, GoodsService, GoodsCacheService, GoodsFavoriteService } from '@app/core/http';
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
  isFavorite$ = this.authService.user$.pipe(
    first(),
    filter(u => !!u),
    switchMap(u => this.goodsFavoriteService.isFavorite(this.goodsRef, u.id).pipe(first()))
  );
  favoriteCount$ = this.goodsFavoriteService.getCountByGoodsRef(this.goodsRef);
  canEdit = false;

  get goodsRef() {
    return this.goodsFavoriteService.getDocRef(this.goodsId);
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private goodsService: GoodsService,
    private goodsCacheService: GoodsCacheService,
    private goodsFavoriteService: GoodsFavoriteService
  ) {
  }

  ngOnInit(): void {
  }

  onClickFavorite() {
    this.authService.user$.pipe(
      first(),
      filter(u => !!u),
      switchMap(u => this.goodsFavoriteService.add({ userId: u.id, goodsRef: this.goodsService.getDocRef(this.goodsId) }))
    ).subscribe();
  }

}
