import { forkJoin, Observable, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuthService, GoodsCommentsService, FavoriteGoodsService, GoodsService, GroupsService, MessagesService, ProfilesService } from '@app/core/http';
import { Goods, MessageExt, ProfileExt } from '@app/core/model';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {
  profileExts$: Observable<ProfileExt[]> = this.authService.user$.pipe(
    switchMap(user => user ?
      this.profilesService.valueChangesQueryByUserId(user.id).pipe(
        switchMap(profiles => {
          return forkJoin(profiles.map(profile => this.groupsService.get(profile.groupId))).pipe(
            map(groups => profiles.map((p, i) => ({ ...p, group: groups[i]})))
          );
        })
      ) :
      of([])
    ),
    shareReplay(1)
  );

  goods$: Observable<Goods[]> = this.authService.profile$.pipe(
    switchMap((profile) => this.goodsService.valueChangesQueryByGroupId(profile.groupId, { limit: 5 })),
    shareReplay(1)
  );

  writeGoods$: Observable<Goods[]> = this.authService.profile$.pipe(
    switchMap(profile => profile ?
      this.goodsService.valueChangesQueryByProfileId(profile.id) :
      of([])
    ),
    shareReplay(1)
  );

  favoriteGoods$: Observable<Goods[]> = this.authService.profile$.pipe(
    switchMap(profile => profile ?
      this.goodsFavoriteService.valueChangesByProfileId(profile.id).pipe(
        switchMap(favorites => favorites.length > 0 ?
          forkJoin(favorites.map(favorite => this.goodsService.get(favorite.goodsId))) :
          of([])
        )
      ) :
      of([])
    ),
    shareReplay(1)
  );

  messageExts$: Observable<MessageExt[]> = this.authService.profile$.pipe(
    switchMap(profile => profile ?
      this.messagesService.valueChangesQueryByProfileId(profile.id).pipe(
        switchMap(messages => {
          return messages.length > 0 ?
            forkJoin ([
              forkJoin(messages.map(m => this.goodsService.get(m.goodsId))),
              forkJoin(messages.map(m => this.goodsCommentsService.get(m.goodsCommentId)))
            ]).pipe(
              map(([goods, goodsComments]) => {
                return messages.map((m, i) => ({ ...m, goods: goods[i], goodsComment: goodsComments[i]}));
              })
            ) :
            of([]);
        }),
      ) :
      of([])
    ),
    shareReplay(1)
  );

  constructor(
    private authService: AuthService,
    private goodsService: GoodsService,
    private goodsFavoriteService: FavoriteGoodsService,
    private goodsCommentsService: GoodsCommentsService,
    private groupsService: GroupsService,
    private messagesService: MessagesService,
    private profilesService: ProfilesService,
  ) {
  }
}
