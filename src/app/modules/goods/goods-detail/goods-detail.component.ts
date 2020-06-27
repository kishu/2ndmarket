import { forkJoin, Observable, of } from 'rxjs';
import { filter, first, map, publish, refCount, share, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, GoodsService, GoodsCacheService, GoodsFavoritesService, ProfilesService } from '@app/core/http';
import { Goods, NewGoodsFavorite } from '@app/core/model';

@Component({
  selector: 'app-goods-detail',
  templateUrl: './goods-detail.component.html',
  styleUrls: ['./goods-detail.component.scss']
})
export class GoodsDetailComponent implements OnInit, OnDestroy {
  goods$: Observable<Goods | Partial<Goods>>;
  favoritesCount$: Observable<number>;
  favorited$: Observable<boolean>;
  permission$: Observable<boolean>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private profilesService: ProfilesService,
    private goodsService: GoodsService,
    private goodsCacheService: GoodsCacheService,
    private goodsFavoritesService: GoodsFavoritesService
  ) {
    const goodsId = this.activatedRoute.snapshot.paramMap.get('goodsId');

    this.goods$ = this.goodsCacheService.getGoods(goodsId).pipe(
      switchMap(g => g ? of(g) : this.goodsService.get(goodsId).pipe(first())),
      map(g => g ? g : { id: '' }),
      share()
    );

    this.permission$ = this.goods$.pipe(
      switchMap(g => {
        return this.authService.profile$.pipe(
          first(),
          filter(p => !!p),
          map(p => p.id === g.profileId)
        );
      })
    );

    const goodsFavorites$ = this.goodsFavoritesService.getAllByGoodsId(goodsId);

    this.favoritesCount$ = goodsFavorites$.pipe(map(f => f.length));
    this.favorited$ = goodsFavorites$.pipe(
      switchMap(favorites => {
        return this.authService.user$.pipe(
          first(),
          filter(u => !!u)
        ).pipe(
          map(u => favorites.some(f => f.userId === u.id))
        );
      })
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.goodsCacheService.removeGoods();
  }

  onClickFavorite(favorite: boolean) {
    const goodsId = this.activatedRoute.snapshot.paramMap.get('goodsId');
    forkJoin([
      this.authService.user$.pipe(first(), filter(u => !!u)),
      this.authService.profile$.pipe(first(), filter(p => !!p))
    ]).pipe(
      switchMap(([u, p]) => {
        if (favorite) {
          return this.goodsFavoritesService.deleteByGoodsIdAndProfileId(goodsId, p.id);
        } else {
          const newGoodsFavorite: NewGoodsFavorite = {
            userId: u.id,
            profileId: p.id,
            goodsId,
            created: GoodsFavoritesService.serverTimestamp()
          };
          return this.goodsFavoritesService.add(newGoodsFavorite);
        }
      })
    ).subscribe();
  }

  onClickDelete() {
    if (confirm('삭제 할까요?')) {
      const goodsId = this.activatedRoute.snapshot.paramMap.get('goodsId');
      this.goodsService.update(goodsId, {activated: false}).then(
        () => this.router.navigate(['goods']),
        (err) => alert(err)
      );
    }
  }

}
