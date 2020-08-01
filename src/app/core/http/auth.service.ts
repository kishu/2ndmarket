import { auth } from 'firebase/app';
import { combineLatest, forkJoin, Observable, ReplaySubject } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ProfileExt, User } from '@app/core/model';
import { GroupsService } from '@app/core/http/groups.service';
import { ProfilesService } from '@app/core/http/profiles.service';
import { ProfileSelectService } from '@app/core/util';

enum AuthProvider {
  google = 'google',
  facebook = 'facebook',
  twitter = 'twitter'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null> = this.afAuth.user.pipe(
    map(user => {
      if (user) {
        return {
          id: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          email: user.email
        } as User;
      } else {
        return null;
      }
    }),
    shareReplay(1)
  );

  profileExts$: Observable<ProfileExt[]> = combineLatest([
    this.user$,
    this.selectProfileService.profileId$
  ]).pipe(
    switchMap(([user, profileId]) => {
      return this.profilesService.getQueryByUserId(user.id).pipe(
        switchMap(profiles => {
          return forkJoin(
            ...profiles.map(profile => this.groupsService.get(profile.groupId))
          ).pipe(
            map(groups => profiles.map((profile, i) => ({ ...profile, group: groups[i] } as ProfileExt)))
          );
        }),
        tap(profileExts => {
          const selectedProfileExt = profileExts.find(p => p.id === profileId);
          this.profileExt$.next(selectedProfileExt);
        })
      );
    }),
    shareReplay(1),
  );

  profileExt$ = new ReplaySubject<ProfileExt>(1);

  // profileExt$: Observable<Profile | null> = combineLatest([
  //   this.user$,
  //   this.selectProfileService.profileId$
  // ]).pipe(
  //   switchMap(([user, selectedProfileId]) => {
  //     if (user) {
  //       return this.profilesService.getQueryByUserId(user.id).pipe(
  //         switchMap(profiles => {
  //           return forkJoin(profiles.map(profile => this.groupsService.get(profile.groupId))).pipe(
  //             map(groups => profiles.map((p, i) => ({ ...p, group: groups[i]})))
  //           );
  //         }),
  //         map(profileExts => {
  //           if (selectedProfileId) {
  //             return profileExts.find(profile => profile.id === selectedProfileId) || null;
  //           } else if (profileExts.length > 0) {
  //             return profileExts[0];
  //           } else {
  //             return null;
  //           }
  //         })
  //       );
  //     } else {
  //       return of(null);
  //     }
  //   }),
  //   tap(t => console.log('switched profile', t)),
  //   shareReplay(1)
  // );

  constructor(
    private afAuth: AngularFireAuth,
    private groupsService: GroupsService,
    private profilesService: ProfilesService,
    private selectProfileService: ProfileSelectService,
  ) {
  }

  signInWithRedirect(provider: string) {
    let authProvider;
    switch (provider) {
      case AuthProvider.google:
        authProvider = new auth.GoogleAuthProvider();
        break;
      case AuthProvider.facebook:
        authProvider = new auth.FacebookAuthProvider();
        break;
      case AuthProvider.twitter:
        authProvider = new auth.TwitterAuthProvider();
        break;
    }
    return this.afAuth.signInWithRedirect(authProvider);
  }

  getRedirectResult() {
    return this.afAuth.getRedirectResult();
  }

  signOut() {
    return this.afAuth.signOut();
  }
}
