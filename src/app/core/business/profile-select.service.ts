import { merge, of } from 'rxjs';
import { filter, first, map, share, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuthService, GroupsService, ProfilesService, UserInfosService } from '@app/core/http';
import { PersistenceService } from '@app/core/persistence';
import { fromPromise } from 'rxjs/internal-compatibility';

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
      tap(() => this.authService.selectedProfile = null),
      switchMap(() => of(null))
    );

    merge(exist$, empty$).subscribe();
  }

  update(id: string) {
    return of(null);
    // return this.profileService.get(id).pipe(
    //   switchMap(profile => {
    //     return this.groupsService.get(profile.groupId).pipe(
    //       map(group => ({ ...profile, group })),
    //     );
    //   }),
    //   tap(profileExt => this.authService.selectedProfile = profileExt)
    // );
  }

  select(id: string) {
    return of(null);
    // const userInfo$ = this.userInfosService.set(
    //   this.authService.user.id,
    //   { profileId: id }
    // );
    //
    // return fromPromise(userInfo$).pipe(
    //   switchMap(() => this.profileService.get(id)),
    //   switchMap(profile => {
    //     return this.groupsService.get(profile.groupId).pipe(
    //       map(group => ({ ...profile, group })),
    //     );
    //   }),
    //   switchMap(profileExt => this.persistenceService.reset(profileExt)),
    //   tap(profileExt => this.authService.selectedProfile = profileExt)
    // );
  }

  remove() {
    this.userInfosService.update(
      this.authService.user.id,
      { profileId: null }
    ).then(() => {
      this.authService.selectedProfile = null;
    });
  }

}
