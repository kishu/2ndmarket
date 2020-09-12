import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, GroupsService, ProfilesService } from '@app/core/http';
import { PersistenceService } from '@app/core/persistence';
import { ProfileSelectService } from '@app/core/business';
import { ProfileExt } from '@app/core/model';

@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.scss']
})
export class PreferenceComponent implements OnInit {
  profileExt$ = this.authService.profileExt$;
  profileExts$ = this.profilesService.getQueryByUserId(this.authService.user.id).pipe(
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
    private persistenceService: PersistenceService,
    private profilesService: ProfilesService,
    private profileSelectService: ProfileSelectService
  ) { }

  ngOnInit(): void {
  }

  onClickProfileSelect(curr: ProfileExt, target: ProfileExt) {
    if (curr.id !== target.id) {
      this.profileSelectService.select(target.id).subscribe(() => {
        this.router.navigate(['/goods']);
      });
    }
  }

  onClickSignOut() {
    this.authService.signOut();
  }

  onClickHistoryBack() {
    this.location.back();
  }

}
