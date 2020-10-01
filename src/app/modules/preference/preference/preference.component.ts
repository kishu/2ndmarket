import { forkJoin } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, GroupsService, ProfilesService } from '@app/core/http';
import { Persistence2Service, PersistenceService } from '@app/core/persistence';
import { ProfileSelectService } from '@app/core/business';
import { AccountExt, ProfileExt } from '@app/core/model';
import { CoverService } from '@app/modules/components/services';
import { environment } from '@environments/environment';
import { AccountsService } from '@app/core/http/accounts.service';

@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.scss']
})
export class PreferenceComponent implements OnInit {
  useProfile = environment.useProfile;
  account$ = this.authService.account$;
  accounts$ = this.authService.account$.pipe(
    switchMap(account => this.accountService.getQueryByUserId(account.userId))
  );
  writeGoodsCount$ = this.persistence2Service.writtenGoods$.pipe(map(g => g.length));
  favoriteGoodsCount$ = this.persistence2Service.favoritedGoods$.pipe(map(g => g.length));
  newMessagesCount$ = this.persistence2Service.newMessageCount$;
  constructor(
    private location: Location,
    private router: Router,
    private authService: AuthService,
    private accountService: AccountsService,
    private groupsService: GroupsService,
    private persistenceService: PersistenceService,
    private persistence2Service: Persistence2Service,
    private profilesService: ProfilesService,
    private profileSelectService: ProfileSelectService,
    private coverService: CoverService
  ) {
  }

  ngOnInit(): void {
  }

  onClickAccountChange(account: AccountExt) {
    this.accountService.activate(account.id).then(() => {
      this.authService.resetAccount$.next();
    });
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
