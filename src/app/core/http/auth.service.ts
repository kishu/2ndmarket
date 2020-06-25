import { auth } from 'firebase/app';
import { Observable, of, ReplaySubject } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ProfilesService } from "@app/core/http/profiles.service";
import { UserProfilesService } from "@app/core/http/user-profiles.service";
import { Group, Profile, User } from '@app/core/model';

enum AuthProvider {
  google = 'google',
  facebook = 'facebook',
  twitter = 'twitter'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user$ = new ReplaySubject<User | null>(1);
  private _profile$ = new ReplaySubject<Profile | null>(1);

  get user$(): Observable<User | null> { return this._user$; }
  get profile$(): Observable<Profile | null > { return this._profile$; }

  constructor(
    private afAuth: AngularFireAuth,
    private userProfilesService: UserProfilesService,
    private profilesService: ProfilesService
  ) {
    const user$ = this.afAuth.user.pipe(
      map(u => {
        if (u) {
          const { uid, displayName, photoURL, email } = u;
          return { id: uid, displayName, photoURL, email };
        } else {
          return null;
        }
      })
    );

    user$.subscribe(u => this._user$.next(u));

    user$.pipe(
      switchMap(u => {
        if (u) {
          return this.userProfilesService.getByUserId(u.id).pipe(
            first(),
            switchMap(userProfiles => {
              return userProfiles.length ? this.profilesService.get(userProfiles[0].profileId) : of(null)
            })
          )
        } else {
          return of(null)
        }
      })
    ).subscribe(p => this._profile$.next(p));
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
