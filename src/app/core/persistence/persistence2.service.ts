import { combineLatest, forkJoin, of, Subject } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Goods, MessageExt, ProfileExt } from '@app/core/model';
import { AuthService, FavoriteGoodsService, GoodsCommentsService, GoodsService, MessagesService } from '@app/core/http';
import { ProfileSelectService } from '@app/core/util';

@Injectable({
  providedIn: 'root'
})
export class Persistence2Service {
  profileExt$ = new Subject<ProfileExt>();
  goods$ = new Subject<Goods>();
  writtenGoods$ = new Subject<Goods>();
  favoritedGoods$ = new Subject<Goods>();
  messagesExt$ = new Subject<MessageExt>();

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
      switchMap(favorites => forkJoin(favorites.map(favorite => this.goodsService.get(favorite.goodsId))))
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
      ).subscribe(([profileExt, goods, writtenGoods, favoritedGoods, messagesExt]) => {
        this.goods$.next(goods);
        this.writtenGoods$.next(writtenGoods);
        this.favoritedGoods$.next(favoritedGoods);
        this.messagesExt$.next(messagesExt);
        resolve();
      });
    });
  }
}
