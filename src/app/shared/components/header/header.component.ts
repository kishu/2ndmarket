import { combineLatest } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileExt } from '@app/core/model';
import { AuthService, GroupsService } from '@app/core/http';
import { PersistenceService } from '@app/core/persistence';
import { HeaderService } from '@app/shared/services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  activatedMenu = false;
  profileExt$ = this.authService.profileExt$;
  title$ = combineLatest([
    this.profileExt$,
    this.headerService.title$
  ]).pipe(
    map(([profile, title]) => title ? { type: 'etc', body: title } : { type: 'group', body: profile.group.name })
  );

  writeGoodsCount$ = this.persistenceService.writtenGoods$.pipe(map(g => g.length));
  favoriteGoodsCount$ = this.persistenceService.favoritedGoods$.pipe(map(g => g.length));
  newMessageExts$ = this.persistenceService.messageExts$.pipe(
    map(messages => messages.filter(m => !m.read))
  );
  profileExts$ = this.authService.profileExts$;

  constructor(
    private router: Router,
    private authService: AuthService,
    private groupsService: GroupsService,
    private headerService: HeaderService,
    private persistenceService: PersistenceService,
  ) {
  }

  ngOnInit(): void {
  }

  toggleMenu() {
    this.activatedMenu = !this.activatedMenu;
  }

  onClickSelectProfile(curr: ProfileExt, target: ProfileExt) {
    if (curr.id !== target.id) {
      this.onCloseMenu();
      this.router.navigate(['/profile-change', target.id], { skipLocationChange: true });
    }
  }

  onCloseMenu() {
    this.activatedMenu = false;
  }

  onClickSignOut() {
    this.activatedMenu = false;
    this.authService.signOut().then(() => this.router.navigate(['/sign-in']));
  }

}
