import { filter, first, map, switchMap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, GroupsService, ProfilesService } from '@app/core/http';
import { PersistenceService } from '@app/core/persistence';
import { ProfileExt } from '@app/core/model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.scss']
})
export class PreferenceComponent implements OnInit {
  profileExt$ = this.authService.profileExt$;
  profileExts$ = this.authService.user$.pipe(
    filter(u => u !== null),
    first(),
    switchMap(u => this.profilesService.getQueryByUserId(u.id)),
    switchMap(profiles => {
      return forkJoin(
        profiles.map(profile => this.groupsService.get(profile.groupId))
      ).pipe(
        map(groups => profiles.map((profile, i) => ({...profile, group: groups[i]} as ProfileExt)))
      );
    })
  );
  writeGoodsCount$ = this.persistenceService.writtenGoods$.pipe(map(g => g.length));
  favoriteGoodsCount$ = this.persistenceService.favoritedGoods$.pipe(map(g => g.length));
  newMessagesCount$ = this.persistenceService.newMessageCount$;
  constructor(
    private location: Location,
    private router: Router,
    private authService: AuthService,
    private groupsService: GroupsService,
    private profilesService: ProfilesService,
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
    this.authService.signOut();
  }

  onClickHistoryBack() {
    this.location.back();
  }

}
