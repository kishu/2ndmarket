import { forkJoin, of, ReplaySubject } from 'rxjs';
import { first, map, skip, switchMap, tap } from 'rxjs/operators';
import { Injectable, OnDestroy } from '@angular/core';
import { Goods, MessageExt } from '@app/core/model';
import { AuthService, FavoriteGoodsService, GoodsCommentsService, GoodsService, MessagesService } from '@app/core/http';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService implements OnDestroy {
  goods$ = new ReplaySubject<Goods[]>(1);
  writtenGoods$ = new ReplaySubject<Goods[]>(1);
  favoritedGoods$ = new ReplaySubject<Goods[]>(1);
  messageExts$ = new ReplaySubject<MessageExt[]>(1);

  updatedAll$ = forkJoin([
    this.goods$.pipe(skip(1), first()),
    this.writtenGoods$.pipe(skip(1), first()),
    this.favoritedGoods$.pipe(skip(1), first()),
    this.messageExts$.pipe(skip(1), first())
  ]).pipe(
    map(() => true)
  );

  constructor(
    private authService: AuthService,
    private favoriteGoodsService: FavoriteGoodsService,
    private goodsService: GoodsService,
    private goodsCommentsService: GoodsCommentsService,
    private messagesService: MessagesService,
  ) {
    this.authService.profileExt$.pipe(
      switchMap(p => this.goodsService.valueChangesQueryByGroupId(p.groupId, {limit: 5})),
    ).subscribe(
      g => this.goods$.next(g)
    );
    this.authService.profileExt$.pipe(
      switchMap(p => this.goodsService.valueChangesQueryByProfileId(p.id)),
    ).subscribe(
      g => this.writtenGoods$.next(g)
    );
    this.authService.profileExt$.pipe(
      switchMap(p => this.favoriteGoodsService.valueChangesByProfileId(p.id).pipe(
        switchMap(fs => forkJoin(fs.map(f => this.goodsService.get(f.goodsId))))
      )),
    ).subscribe(
      g => this.favoritedGoods$.next(g)
    );
    this.authService.profileExt$.pipe(
      switchMap(p => this.messagesService.valueChangesQueryByProfileId(p.id).pipe(
        switchMap(messages => {
          return messages.length === 0 ? of([]) : forkJoin([
            forkJoin(...messages.map(m => this.goodsService.get(m.goodsId))),
            forkJoin(...messages.map(m => this.goodsCommentsService.get(m.goodsCommentId)))
          ]).pipe(
            map(([goods, goodsComments]) => messages.map((m, i) => {
              return {...m, goods: goods[i], goodsComment: goodsComments[i]} as MessageExt;
            }))
          );
        })
      ))
    ).subscribe(
      m => this.messageExts$.next(m)
    );
  }

  ngOnDestroy() {
    this.goods$?.unsubscribe();
    this.writtenGoods$?.unsubscribe();
    this.favoritedGoods$?.unsubscribe();
    this.messageExts$?.unsubscribe();
  }

}
