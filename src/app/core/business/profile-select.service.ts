import { merge, of } from 'rxjs';
import { filter, first, map, share, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuthService, GroupsService, ProfilesService, UserInfosService } from '@app/core/http';
import { PersistenceService } from '@app/core/persistence';

@Injectable({
  providedIn: 'root'
})
export class ProfileSelectService {
  constructor(
    private authService: AuthService,
    private groupsService: GroupsService,
    private profileService: ProfilesService,
    private persistenceService: PersistenceService,
    private userInfosService: UserInfosService
  ) {
    const user$ = this.authService.user$.pipe(
      first(),
      share()
    );

    const exist$ = user$.pipe(
      first(),
      filter(u => !!u),
      switchMap(u => this.userInfosService.get(u.id)),
      switchMap(userInfo => {
        if (userInfo?.profileId) {
          return this.select(userInfo.profileId);
        } else {
          this.authService.selectedProfile = null;
          return of(null);
        }
      })
    );

    const empty$ = user$.pipe(
      first(),
      filter(u => !u),
      switchMap(() => of(null))
    );

    merge(exist$, empty$).subscribe();
  }

  update(id: string) {
    return this.profileService.get(id).pipe(
      switchMap(profile => {
        return this.groupsService.get(profile.groupId).pipe(
          map(group => ({ ...profile, group })),
        );
      }),
      tap(profileExt => this.authService.selectedProfile = profileExt)
    );
  }

  select(id: string) {
    const profileExt$ = this.profileService.get(id).pipe(
      switchMap(profile => {
        return this.groupsService.get(profile.groupId).pipe(
          map(group => ({ ...profile, group })),
        );
      }),
      share()
    );

    const exist$ = profileExt$.pipe(
      first(),
      filter(profileExt => profileExt !== null),
      switchMap(profileExt => this.persistenceService.reset(profileExt)),
      tap(profileExt => localStorage.setItem('profileId', profileExt.id)),
      tap(profileExt => this.authService.selectedProfile = profileExt)
    );

    const empty$ = profileExt$.pipe(
      first(),
      filter(profileExt => !profileExt),
      tap(() => this.remove())
    );

    return merge(exist$, empty$);
  }

  remove() {
    localStorage.removeItem('profileId');
    this.authService.selectedProfile = null;
  }

}
