import { of, ReplaySubject } from 'rxjs';
import { filter, first, map, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ProfileExt } from '@app/core/model/profile';
import { AuthService, GroupsService, ProfilesService } from '@app/core/http';
import { PersistenceService } from '@app/core/persistence';

@Injectable({
  providedIn: 'root'
})
export class ProfileSelectService {
  selectedProfileExt$ = new ReplaySubject<ProfileExt | null>(1);

  constructor(
    private authService: AuthService,
    private groupsService: GroupsService,
    private profileService: ProfilesService,
    private persistenceService: PersistenceService
  ) {
    this.authService.user$.pipe(
      first(),
      map(u => u ? localStorage.getItem('profileId') : null),
      switchMap(profileId => this.select(profileId).pipe(first()))
    ).subscribe();
  }

  select(id: string) {
    if (!id) {
      this.remove();
      return of(null);
    }

    return this.profileService.get(id).pipe(
      switchMap(profile => {
        return this.groupsService.get(profile.groupId).pipe(
          map(group => ({ ...profile, group })),
        );
      }),
      switchMap(profileExt => this.persistenceService.reset(profileExt)),
      tap(profileExt => localStorage.setItem('profileId', profileExt.id)),
      tap(profileExt => this.authService.selectedProfile = profileExt)
    );
  }

  remove() {
    localStorage.removeItem('profileId');
    this.authService.selectedProfile = null;
  }

}
