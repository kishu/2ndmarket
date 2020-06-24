import { forkJoin, Observable, of } from 'rxjs';
import { filter, first, map, share, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, GoodsService, GoodsCacheService, GoodsFavoritesService } from '@app/core/http';
import { Goods, User } from '@app/core/model';

@Component({
  selector: 'app-goods-detail',
  templateUrl: './goods-detail.component.html',
  styleUrls: ['./goods-detail.component.scss']
})
export class GoodsDetailComponent implements OnInit {
  user$: Observable<User>;
  goods$: Observable<Goods>;
  favoritesCount$: Observable<number>;
  favorited$: Observable<boolean>;
  canEdit = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private goodsService: GoodsService,
    private goodsCacheService: GoodsCacheService,
    private goodsFavoritesService: GoodsFavoritesService
  ) {
    const goodsId = this.activatedRoute.snapshot.paramMap.get('goodsId');
    this.user$ = this.authService.user$.pipe(first(), filter(u => !!u), share());
    this.goods$ = this.goodsCacheService.getGoods(goodsId).pipe(
      switchMap(g => g ? of(g) : this.goodsService.get(goodsId).pipe(first())),
      tap(g => this.user$.subscribe(u => this.canEdit = g.userId === u.id)),
    );
    const goodsFavorites$ = this.user$.pipe(
      switchMap(u =>  this.goodsFavoritesService.getAllByGoodsRef(goodsId))
    );
    this.favoritesCount$ = goodsFavorites$.pipe(map(f => f.length));
    this.favorited$ = goodsFavorites$.pipe(
      withLatestFrom(this.user$),
      map(([f, u]) => f.some(i => i.userId === u.id)),
    );
  }

  ngOnInit(): void {
  }

  onClickFavorite(favorite: boolean) {
    const goodsId = this.activatedRoute.snapshot.paramMap.get('goodsId');
    const goodsRef = this.goodsService.getDocRef(goodsId);
    this.user$.pipe(
      switchMap(u => favorite ?
        this.goodsFavoritesService.deleteBy(u.id, goodsRef) :
        this.goodsFavoritesService.add({ userId: u.id, goodsRef })
      )
    ).subscribe();
  }

}
