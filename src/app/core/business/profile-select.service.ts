import { merge, of } from 'rxjs';
import { filter, first, map, share, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuthService, GroupsService, ProfilesService } from '@app/core/http';
import { PersistenceService } from '@app/core/persistence';

@Injectable({
  providedIn: 'root'
})
export class ProfileSelectService {
  constructor(
    private authService: AuthService,
    private groupsService: GroupsService,
    private profileService: ProfilesService,
    private persistenceService: PersistenceService
  ) {
    this.authService.user$.pipe(
      first(),
      switchMap(user => {
        const profileId = localStorage.getItem('profileId');
        if (user && profileId) {
          return this.select(profileId);
        } else {
          this.authService.selectedProfile = null;
          return of(null);
        }
      })
    ).subscribe();
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
