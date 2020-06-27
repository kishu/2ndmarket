import { forkJoin, Observable, of } from 'rxjs';
import { filter, first, map, share, switchMap, tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AuthService,
  GoodsService,
  GoodsCacheService,
  GoodsFavoritesService,
  ProfilesService,
  CloudinaryService
} from '@app/core/http';
import { Goods, NewGoodsFavorite } from '@app/core/model';

@Component({
  selector: 'app-goods-detail',
  templateUrl: './goods-detail.component.html',
  styleUrls: ['./goods-detail.component.scss']
})
export class GoodsDetailComponent implements OnInit {
  goods$: Observable<Goods>;
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
      tap(g => console.log('g', g)),
      share()
    );

    this.permission$ = this.authService.profile$.pipe(
      first(),
      filter(p => !!p),
      switchMap(p => this.goods$.pipe(map(g => g.profileId === p.id)))
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
        )
      })
    );
  }

  ngOnInit(): void {
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
    this.goods$.subscribe(g => {
      this.goodsService.delete(g.id);
      alert('ok');
    });
  }

}
