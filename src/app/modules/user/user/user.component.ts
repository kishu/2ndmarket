import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { filter, first, map, share, switchMap, tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AuthService, GoodsFavoritesService, GoodsService, GroupsService, ProfilesService, UserProfilesService } from '@app/core/http';
import { Group, Profile } from '@app/core/model';

export interface GroupWithProfile extends Group{
  profile: Profile;
}

enum GoodsListType {
  write = 'write',
  favorite = 'favorite'
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  goodsListType$ = new BehaviorSubject<GoodsListType>(GoodsListType.write);
  profile$ = this.authService.profile$.pipe(first(), filter(p => !!p), share());
  groupWithProfiles$: Observable<GroupWithProfile[]> = this.authService.user$.pipe(
    first(),
    filter(u => !!u),
    switchMap(u => this.userProfilesService.getAllByUserId(u.id).pipe(first())),
    switchMap(userProfiles => forkJoin(...userProfiles.map(userProfile => this.profilesService.get(userProfile.profileId).pipe(first())))),
    switchMap(profiles => {
      return forkJoin(...profiles.map(profile => {
        return this.groupService.get(profile.groupId).pipe(
          first(),
          map(group => ({ ...group, profile }))
        );
      }));
    })
  );
  writeGoodsList$ = this.profile$.pipe(
    switchMap(p => this.goodsService.getAllByProfileId(p.id).pipe(first()))
  );
  favoriteGoodsList$ = this.profile$.pipe(
    switchMap(p => this.goodsFavoriteService.getAllByProfileId(p.id).pipe(first())),
    map(fs => fs.map(f => this.goodsService.get(f.goodsId).pipe(first()))),
    switchMap(goods$ => forkJoin([...goods$]))
  );

  constructor(
    private authService: AuthService,
    private goodsService: GoodsService,
    private goodsFavoriteService: GoodsFavoritesService,
    private groupService: GroupsService,
    private profilesService: ProfilesService,
    private userProfilesService: UserProfilesService
  ) {
  }

  ngOnInit(): void {
  }

  onClickGoodsListType(type: string) {
    this.goodsListType$.next(type as GoodsListType);
  }

}
