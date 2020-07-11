import { auth } from 'firebase/app';
import { combineLatest, Observable, of } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ProfileSelectService } from '@app/core/util';
import { ProfilesService } from '@app/core/http/profiles.service';
import { UserProfilesService } from '@app/core/http/user-profiles.service';
import { Profile, User } from '@app/core/model';

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

  profile$: Observable<Profile | null> = combineLatest([
    this.user$,
    this.selectProfileService.profileId$
  ]).pipe(
    switchMap(([user, selectedProfileId]) => {
      if (user) {
        return this.profilesService.getQueryByUserId(user.id).pipe(
          map(profiles => {
            if (selectedProfileId) {
              return profiles.find(profile => profile.id === selectedProfileId) || null;
            } else if (profiles.length > 0) {
              return profiles[0];
            } else {
              return null;
            }
          })
        );
      } else {
        return of(null);
      }
    }),
    tap(t => console.log('switched profile', t)),
    shareReplay(1)
  );

  constructor(
    private afAuth: AngularFireAuth,
    private userProfilesService: UserProfilesService,
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
