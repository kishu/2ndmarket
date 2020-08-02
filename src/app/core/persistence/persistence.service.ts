import { forkJoin, of, ReplaySubject, Subject } from 'rxjs';
import { first, map, shareReplay, skip, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Injectable, OnDestroy } from '@angular/core';
import { Goods, MessageExt } from '@app/core/model';
import { AuthService, FavoriteGoodsService, GoodsCommentsService, GoodsService, MessagesService } from '@app/core/http';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService implements OnDestroy {
  private destroy$ = new Subject<null>();

  goods$ = this.authService.profileExt$.pipe(
    switchMap(p => this.goodsService.valueChangesQueryByGroupId(p.groupId, {limit: 5})),
    takeUntil(this.destroy$),
    shareReplay(1),
  );
  writtenGoods$ = this.authService.profileExt$.pipe(
    switchMap(p => this.goodsService.valueChangesQueryByProfileId(p.id)),
    shareReplay(1)
  );
  favoritedGoods$ = this.authService.profileExt$.pipe(
    switchMap(p => this.favoriteGoodsService.valueChangesByProfileId(p.id).pipe(
      takeUntil(this.destroy$),
      switchMap(fs => forkJoin(...fs.map(f => this.goodsService.get(f.goodsId))))
    )),
    shareReplay(1)
  );
  messageExts$ = this.authService.profileExt$.pipe(
    switchMap(p => {
      return this.messagesService.valueChangesQueryByProfileId(p.id).pipe(
        takeUntil(this.destroy$),
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
      );
    }),
    shareReplay(1)
  );


  constructor(
    private authService: AuthService,
    private favoriteGoodsService: FavoriteGoodsService,
    private goodsService: GoodsService,
    private goodsCommentsService: GoodsCommentsService,
    private messagesService: MessagesService,
  ) {
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

}
