import { of, ReplaySubject } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { Injectable, OnDestroy } from '@angular/core';
import { ProfileExt } from '@app/core/model/profile';
import { AuthService } from '@app/core/http/auth.service';
import { GroupsService } from '@app/core/http/groups.service';
import { ProfilesService } from '@app/core/http/profiles.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileSelectService implements OnDestroy {
  profileId$ = new ReplaySubject<string | null>(1);
  selectedProfileExt$ = new ReplaySubject<ProfileExt | null>(1);

  constructor(
    private authService: AuthService,
    private groupsService: GroupsService,
    private profileService: ProfilesService
  ) {
    const id = localStorage.getItem('profileId');
    this.profileId$.next(id);
    console.log('profileId$.next', id);
  }

  ngOnDestroy() {
    this.profileId$.complete();
  }

  select(id: string, next: boolean = true) {
    this.profileService.get(id).pipe(
      switchMap(profile => {
        return this.groupsService.get(profile.groupId).pipe(
          map(group => ({ ...profile, group })),
        );
      })
    ).subscribe(profileExt => {
      localStorage.setItem('profileId', profileExt.id);
      this.selectedProfileExt$.next(profileExt);
    });
    // if (next) {
    //   this.profileId$.next(id);
    //   console.log('profileId$.next', id);
    // }
  }

  remove() {
    localStorage.removeItem('profileId');
    this.selectedProfileExt$.next(null);
    // this.profileId$.next(null);
  }

}
