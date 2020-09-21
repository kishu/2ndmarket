import { forkJoin } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, GroupsService, ProfilesService } from '@app/core/http';
import { PersistenceService } from '@app/core/persistence';
import { ProfileSelectService } from '@app/core/business';
import { ProfileExt } from '@app/core/model';
import { CoverService } from '@app/modules/components/services';

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
    private profileSelectService: ProfileSelectService,
    private coverService: CoverService
  ) {
  }

  ngOnInit(): void {
  }

  onClickProfileSelect(curr: ProfileExt, target: ProfileExt) {
    if (curr.id !== target.id) {
      this.coverService.show('프로필을 변경하고 있습니다.');
      this.profileSelectService.select(target.id).pipe(first()).subscribe(() => {
        this.coverService.hide();
        this.router.navigate(['/goods']);
      }, err => {
        alert(err);
        this.coverService.hide();
      });
    }
  }

  onClickSignOut() {
    this.authService.signOut().then(() => this.router.navigate(['/auth/sign-in']));
  }

  onClickHistoryBack() {
    this.location.back();
  }

}
