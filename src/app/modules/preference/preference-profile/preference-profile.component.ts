import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { filter, first, map, share, switchMap, tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AuthService, GoodsFavoritesService, GoodsService, GroupsService, ProfilesService, UserProfilesService } from '@app/core/http';
import { Group, Profile } from '@app/core/model';

enum GoodsListType {
  write = 'write',
  favorite = 'favorite'
}

@Component({
  selector: 'app-preference-profile',
  templateUrl: './preference-profile.component.html',
  styleUrls: ['./preference-profile.component.scss']
})
export class PreferenceProfileComponent implements OnInit {
  goodsListType$ = new BehaviorSubject<GoodsListType>(GoodsListType.write);
  profile$ = this.authService.profile$.pipe(first(), filter(p => !!p), share());
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
    private goodsFavoriteService: GoodsFavoritesService
  ) {
  }

  ngOnInit(): void {
  }

  onClickGoodsListType(type: string) {
    this.goodsListType$.next(type as GoodsListType);
  }

}
