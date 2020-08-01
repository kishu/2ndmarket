import { combineLatest, forkJoin, of, ReplaySubject } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Goods, MessageExt, ProfileExt } from '@app/core/model';
import { AuthService, FavoriteGoodsService, GoodsCommentsService, GoodsService, MessagesService } from '@app/core/http';
import { ProfileSelectService } from '@app/core/util';

@Injectable({
  providedIn: 'root'
})
export class Persistence2Service {
  profileExt$ = new ReplaySubject<ProfileExt>(1);
  goods$ = new ReplaySubject<Goods>(1);
  writtenGoods$ = new ReplaySubject<Goods>(1);
  favoritedGoods$ = new ReplaySubject<Goods>(1);
  messagesExt$ = new ReplaySubject<MessageExt>(1);

  constructor(
    private authService: AuthService,
    private favoriteGoodsService: FavoriteGoodsService,
    private goodsService: GoodsService,
    private goodsCommentsService: GoodsCommentsService,
    private messagesService: MessagesService,
    private profileSelectService: ProfileSelectService
  ) {
    this.profileSelectService.profileId$.pipe(first()).subscribe(profileId => this.updateBy(profileId));
  }

  updateBy(profileId: string): Promise<null> {
    const goods$ = gId => this.goodsService.valueChangesQueryByGroupId(gId, {limit: 5});
    const writtenGoods$ = pId => this.goodsService.valueChangesQueryByProfileId(pId);
    const favoriteGoods$ = pId => this.favoriteGoodsService.valueChangesByProfileId(pId).pipe(
      switchMap(favorites => forkJoin(favorites.map(f => this.goodsService.get(f.goodsId))))
    );
    const messages$ = pId => this.messagesService.valueChangesQueryByProfileId(pId).pipe(
      switchMap(messages => {
        return forkJoin([
          forkJoin(...messages.map(m => this.goodsService.get(m.goodsId))),
          forkJoin(...messages.map(m => this.goodsCommentsService.get(m.goodsCommentId)))
        ]).pipe(
          map(([goods, goodsComments]) => messages.map((m, i) => {
            return {...m, goods: goods[i], goodsComment: goodsComments[i]} as MessageExt;
          }))
        );
      })
    );

    return new Promise((resolve, reject) => {
      this.authService.profileExts$.pipe(
        first(),
        switchMap(profileExts => {
          const selectedProfileExt = profileExts.find(p => p.id === profileId);
          return selectedProfileExt ?
            combineLatest([
              goods$(selectedProfileExt.groupId),
              writtenGoods$(selectedProfileExt.id),
              favoriteGoods$(selectedProfileExt.id),
              messages$(selectedProfileExt.id),
            ]) :
            of([]);
        })
      ).subscribe(([goods, writtenGoods, favoritedGoods, messagesExt]) => {
        this.goods$.next(goods);
        this.writtenGoods$.next(writtenGoods);
        this.favoritedGoods$.next(favoritedGoods);
        this.messagesExt$.next(messagesExt);
        resolve();
      });
    });
  }
}
