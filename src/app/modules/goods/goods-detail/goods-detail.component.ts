import { combineLatest, forkJoin, Observable, of } from 'rxjs';
import { filter, first, map, partition, share, shareReplay, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, GoodsService, GoodsFavoritesService, ProfilesService } from '@app/core/http';
import { Goods, NewGoodsFavorite } from '@app/core/model';

@Component({
  selector: 'app-goods-detail',
  templateUrl: './goods-detail.component.html',
  styleUrls: ['./goods-detail.component.scss']
})
export class GoodsDetailComponent implements OnInit {
  goods$: Observable<Goods> = this.goodsService.get(this.goodsId).pipe(shareReplay());
  empty$: Observable<boolean> = this.goods$.pipe(map(g => !g));
  permission$: Observable<boolean> = combineLatest([
    this.goods$,
    this.authService.profile$.pipe(filter(p => !!p), first())
  ]).pipe(
    map(([g, p]) => g.profileId === p.id)
  );
  favorited$: Observable<boolean> = combineLatest([
    this.goods$,
    this.authService.profile$.pipe(filter(p => !!p), first())
  ]).pipe(
    switchMap(([g, p]) => this.goodsFavoritesService.getAllByGoodsIdAndProfileId(g.id, p.id)),
    map(f => f.length > 0)
  );

  private get goodsId() {
    return this.activatedRoute.snapshot.paramMap.get('goodsId');
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private profilesService: ProfilesService,
    private goodsService: GoodsService,
    private goodsFavoritesService: GoodsFavoritesService
  ) {
  }

  ngOnInit(): void {
  }

  onClickSoldOut() {
    const goodsId = this.goodsId;
    this.goodsService.get(goodsId).pipe(
      first(),
      filter(g => !!g),
      map(g => !!g.soldOut),
      switchMap(soldOut => this.goodsService.updateSoldOut(goodsId, !soldOut))
    ).subscribe(
      () => {},
      err => alert(err)
    );
  }

  onClickFavorite() {
    const goodsId = this.goodsId;
    const add$ = combineLatest([
      this.authService.user$.pipe(first(), filter(u => !!u)),
      this.authService.profile$.pipe(first(), filter(p => !!p))
    ]).pipe(
      switchMap(([u, p]) => {
        return this.goodsFavoritesService.add({
          userId: u.id,
          profileId: p.id,
          goodsId,
          created: GoodsFavoritesService.serverTimestamp()
        } as NewGoodsFavorite);
      })
    );
    const delete$ = combineLatest([
      this.authService.profile$.pipe(first(), filter(p => !!p))
    ]).pipe(
      switchMap(([p]) => this.goodsFavoritesService.deleteByGoodsIdAndProfileId(goodsId, p.id))
    );

    this.favorited$.pipe(
      first(),
      switchMap(f => !f ? add$ : delete$)
    ).subscribe(
      () => {},
      err => alert(err)
    );
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
