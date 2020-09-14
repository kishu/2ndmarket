import { forkJoin, of, ReplaySubject, Subject } from 'rxjs';
import { filter, first, map, mapTo, skip, switchMap } from 'rxjs/operators';
import { Injectable, OnDestroy } from '@angular/core';
import { Goods, MessageExt, ProfileExt } from '@app/core/model';
import { AuthService, FavoriteGoodsService, GoodsCommentsService, GoodsService, MessagesService } from '@app/core/http';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService implements OnDestroy {
  goods$ = new ReplaySubject<Goods[]>(1);
  writtenGoods$ = new ReplaySubject<Goods[]>(1);
  favoritedGoods$ = new ReplaySubject<Goods[]>(1);
  messageExts$ = new ReplaySubject<MessageExt[]>(1);
  newMessageCount$ = new ReplaySubject<number>(1);

  private reset$ = new Subject<ProfileExt>();

  protected goodsSubscription = this.reset$.pipe(
    // switchMap(p => this.goodsService.valueChangesQueryByGroupId(p.groupId, { limit: 5 }))
    switchMap(p => {
      return this.goodsService.getQueryByGroupId(p.groupId, { limit: 5 }).pipe(
        switchMap(() => this.goodsService.valueChangesQueryByGroupId(p.groupId, { limit: 5 }))
      );
    }),
  ).subscribe(g => this.goods$.next(g));

  protected writtenGoodsSubscription = this.reset$.pipe(
    switchMap(p => this.goodsService.valueChangesQueryByProfileId(p.id)),
  ).subscribe(g => this.writtenGoods$.next(g));

  protected favoritedGoodsSubscription = this.reset$.pipe(
    switchMap(p => this.favoriteGoodsService.valueChangesByProfileId(p.id).pipe(
      switchMap(fs => forkJoin(fs.map(f => this.goodsService.get(f.goodsId))))
    )),
  ).subscribe(g => this.favoritedGoods$.next(g));

  protected messageExtsSubscription = this.reset$.pipe(
    switchMap(p => {
      return this.messagesService.valueChangesQueryByProfileId(p.id).pipe(
        switchMap(messages => {
          this.newMessageCount$.next(messages.filter(m => !m.read).length);
          return messages.length === 0 ? of([]) : forkJoin([
            forkJoin(messages.map(m => this.goodsService.get(m.goodsId))),
            forkJoin(messages.map(m => this.goodsCommentsService.get(m.goodsCommentId)))
          ]).pipe(
            map(([goods, goodsComments]) => messages.map((m, i) => {
              return {...m, goods: goods[i], goodsComment: goodsComments[i]} as MessageExt;
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
    this.authService.profileExt$.pipe(
      filter(p => p !== null),
      first()
    ).subscribe(p => this.reset$.next(p));
  }

  reset(profileExt: ProfileExt) {
    this.goods$.next([]);
    this.writtenGoods$.next([]);
    this.favoritedGoods$.next([]);
    this.messageExts$.next([]);
    this.newMessageCount$.next(0);

    this.reset$.next(profileExt);

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
    this.reset$.complete();
  }

}
