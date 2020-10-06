import { forkJoin, of, ReplaySubject, Subject } from 'rxjs';
import { filter, first, map, mapTo, skip, switchMap, tap } from 'rxjs/operators';
import { isEmpty } from 'lodash-es';
import { Injectable, OnDestroy } from '@angular/core';
import { Goods, MessageExt, ProfileExt } from '@app/core/model';
import { AuthService, FavoriteGoodsService, GoodsCommentsService, GoodsService, MessagesService } from '@app/core/http';

@Injectable({
  providedIn: 'root'
})
export class Persistence2Service implements OnDestroy {
  goods$ = new ReplaySubject<Goods[]>(1);
  writtenGoods$ = new ReplaySubject<Goods[]>(1);
  favoritedGoods$ = new ReplaySubject<Goods[]>(1);
  messageExts$ = new ReplaySubject<MessageExt[]>(1);
  newMessageCount$ = new ReplaySubject<number>(1);

  protected goodsSubscription = this.authService.membership$.pipe(
    filter(m => m !== null),
    switchMap(m => {
      return this.goodsService.getQueryByGroupId(m.groupId, { limit: 5 }).pipe(
        switchMap(() => this.goodsService.valueChangesQueryByGroupId(m.groupId, { limit: 5 }))
      );
    }),
    tap(g => console.log('goods', g))
  ).subscribe(g => this.goods$.next(g));

  protected writtenGoodsSubscription = this.authService.membership$.pipe(
    filter(m => m !== null),
    switchMap(m => this.goodsService.valueChangesQueryByProfileId(m.profileId)),
  ).subscribe(g => this.writtenGoods$.next(g));

  protected favoritedGoodsSubscription = this.authService.membership$.pipe(
    switchMap(m => m ?
      this.favoriteGoodsService.valueChangesByProfileId(m.profileId).pipe(
        switchMap(favorites => isEmpty(favorites) ? of([]) : forkJoin(favorites.map(f => this.goodsService.get(f.goodsId)))),
      ) :
      of([])
    ),
  ).subscribe(g => this.favoritedGoods$.next(g));

  protected messageExtsSubscription = this.authService.membership$.pipe(
    filter(m => m !== null),
    switchMap(m => {
      return this.messagesService.valueChangesQueryByProfileId(m.profileId).pipe(
        switchMap(messages => {
          this.newMessageCount$.next(messages.filter(ms => !ms.read).length);
          return messages.length === 0 ? of([]) : forkJoin([
            forkJoin(messages.map(ms => this.goodsService.get(ms.goodsId))),
            forkJoin(messages.map(ms => this.goodsCommentsService.get(ms.goodsCommentId)))
          ]).pipe(
            map(([goods, goodsComments]) => messages.map((ms, i) => {
              return {...ms, goods: goods[i], goodsComment: goodsComments[i]} as MessageExt;
            }))
          );
        }),
      );
    })
  ).subscribe(m => this.messageExts$.next(m));

  constructor(
    private authService: AuthService,
    private favoriteGoodsService: FavoriteGoodsService,
    private goodsService: GoodsService,
    private goodsCommentsService: GoodsCommentsService,
    private messagesService: MessagesService,
  ) {
  }

  reset(profileExt: ProfileExt) {
    return;

    this.goods$.next([]);
    this.writtenGoods$.next([]);
    this.favoritedGoods$.next([]);
    this.messageExts$.next([]);
    this.newMessageCount$.next(0);

    // this.reset$.next(profileExt);

    return forkJoin([
      this.goods$.pipe(skip(1), first()),
      // this.writtenGoods$.pipe(skip(1), first()),
      // this.favoritedGoods$.pipe(skip(1), first()),
      // this.messageExts$.pipe(skip(1), first()),
      // this.newMessageCount$.pipe(skip(1), first())
    ]).pipe(
      mapTo(profileExt)
    );
  }

  ngOnDestroy() {
    [
      this.goods$,
      this.writtenGoods$,
      this.favoritedGoods$,
      this.messageExts$,
      this.newMessageCount$,
    ].forEach(s => s.complete());
    [
      this.goodsSubscription,
      this.writtenGoodsSubscription,
      this.favoritedGoodsSubscription,
      this.messageExtsSubscription
    ].forEach(o => o.unsubscribe());
  }

}
