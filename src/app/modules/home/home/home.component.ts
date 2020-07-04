import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/http/auth.service';
import { filter, first, map, shareReplay, switchMap } from 'rxjs/operators';
import { GoodsService, GoodsFavoritesService, UserProfilesService, NoticesService } from '@app/core/http';
import { ProfileSelectService } from '@app/core/util';
import { Profile } from '@app/core/model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  profile$ = this.authService.profile$.pipe(filter(p => !!p), shareReplay(1));
  noticeCount$ = this.profile$.pipe(
    switchMap(p => this.noticeService.getQueryByProfileIdAndUnread(p.id)),
    map(noticeList => noticeList.length)
  );
  writeGoodsCount$ = this.profile$.pipe(
    switchMap(p => this.goodsService.getQueryByProfileId(p.id)),
    map(goodsList => goodsList.length)
  );
  favoriteGoodsCount$ = this.profile$.pipe(
    switchMap(p => this.goodsFavoriteService.getQueryByProfileId(p.id)),
    map(favoriteList => favoriteList.length)
  );
  userProfileList$ = this.authService.user$.pipe(
    first(),
    filter(u => !!u),
    switchMap(u => this.userProfilesService.getQueryByUserId(u.id).pipe())
  );
  selectedProfileId$ = this.profileSelectService.profileId$.pipe();

  constructor(
    private authService: AuthService,
    private goodsService: GoodsService,
    private goodsFavoriteService: GoodsFavoritesService,
    private noticeService: NoticesService,
    private profileSelectService: ProfileSelectService,
    private userProfilesService: UserProfilesService,
  ) {
  }

  ngOnInit(): void {
  }

  onClickSelectProfile(profile: Profile) {
    this.profileSelectService.select(profile.id);
  }

  onClickSignOut(e: Event) {
    e.preventDefault();
    this.authService.signOut();
  }

}
