import { map } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/http';
import { PersistenceService } from '@app/core/persistence';
import { ProfileExt } from '@app/core/model';

@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.scss']
})
export class PreferenceComponent implements OnInit {
  profileExt$ = this.authService.profileExt$;
  profileExts$ = this.authService.profileExts$;
  writeGoodsCount$ = this.persistenceService.writtenGoods$.pipe(map(g => g.length));
  favoriteGoodsCount$ = this.persistenceService.favoritedGoods$.pipe(map(g => g.length));
  newMessagesCount$ = this.persistenceService.newMessageCount$;
  constructor(
    private location: Location,
    private router: Router,
    private authService: AuthService,
    private persistenceService: PersistenceService,
  ) { }

  ngOnInit(): void {
  }

  onClickSelectProfile(curr: ProfileExt, target: ProfileExt) {
    if (curr.id !== target.id) {
      this.router.navigate(['/profile-change', target.id], { skipLocationChange: true });
    }
  }

  onClickSignOut() {
    this.authService.signOut().then(() => this.router.navigate(['/sign-in']));
  }

  onClickHistoryBack() {
    this.location.back();
  }

}
