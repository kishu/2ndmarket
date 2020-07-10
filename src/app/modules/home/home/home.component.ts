import { filter, map, shareReplay } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/http';
import { PersistenceService } from '@app/core/persistence';
import { ProfileSelectService } from '@app/core/util';
import { ProfileExt } from '@app/core/model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  profile$ = this.authService.profile$.pipe(filter(p => !!p), shareReplay(1));
  writeGoodsCount$ = this.persistenceService.writeGoods$.pipe(map(g => g.length));
  favoriteGoodsCount$ = this.persistenceService.favoriteGoods$.pipe(map(g => g.length));
  profileExts$ = this.persistenceService.profileExts$;
  selectedProfileId$ = this.profileSelectService.profileId$.pipe();

  constructor(
    private authService: AuthService,
    private profileSelectService: ProfileSelectService,
    private persistenceService: PersistenceService,
  ) {
  }

  ngOnInit(): void {
  }

  onClickSelectProfile(profileExt: ProfileExt) {
    this.profileSelectService.select(profileExt.id);
  }

}
