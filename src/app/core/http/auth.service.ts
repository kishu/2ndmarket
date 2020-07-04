import { auth } from 'firebase/app';
import { combineLatest, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { filter, first, map, shareReplay, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ProfileSelectService } from '@app/core/util';
import { ProfilesService } from '@app/core/http/profiles.service';
import { UserProfilesService } from '@app/core/http/user-profiles.service';
import { GroupsService } from '@app/core/http/groups.service';
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
  // private _user$ = new ReplaySubject<User | null>(1);
  // private _profile$ = new ReplaySubject<Profile | null>(1);
  //
  // get user$(): Observable<User | null> { return this._user$; }
  // get profile$(): Observable<Profile | null > { return this._profile$; }

  user$: Observable<User> = this.afAuth.user.pipe(
    filter(user => !!user),
    map(user => ({
      id: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      email: user.email
    } as User)),
    shareReplay(1)
  );

  profile$: Observable<Profile> = combineLatest([
    this.afAuth.user,
    this.selectProfileService.profileId$
  ]).pipe(
    filter(([user, profileId]) => !!user && !!profileId),
    switchMap(([user, profileId]) => {
      return this.userProfilesService.getQueryByUserIdAndProfileId(user.uid, profileId).pipe(
        first(),
        filter(userProfiles => userProfiles.length > 0),
        switchMap(userProfiles => this.profilesService.get(userProfiles[0].profileId).pipe(first()))
      );
    }),
    tap(t => console.log('switched profile', t)),
    shareReplay(1)
  );

  group$: Observable<Group> = this.profile$.pipe(
    filter(profile => !!profile),
    switchMap(profile => this.groupsService.get(profile.groupId).pipe(first())),
    shareReplay(1)
  );

  constructor(
    private afAuth: AngularFireAuth,
    private userProfilesService: UserProfilesService,
    private profilesService: ProfilesService,
    private selectProfileService: ProfileSelectService,
    private groupsService: GroupsService
  ) {
    // const user$ = this.afAuth.user.pipe(
    //   map(u => {
    //     if (u) {
    //       const { uid, displayName, photoURL, email } = u;
    //       return { id: uid, displayName, photoURL, email };
    //     } else {
    //       return null;
    //     }
    //   })
    // );
    //
    // user$.subscribe(u => this._user$.next(u));
    //
    // user$.pipe(
    //   switchMap(u => {
    //     if (u) {
    //       return this.userProfilesService.getAllByUserId(u.id).pipe(
    //         first(),
    //         switchMap(userProfiles => {
    //           return userProfiles.length ? this.profilesService.get(userProfiles[0].profileId) : of(null);
    //         })
    //       );
    //     } else {
    //       return of(null);
    //     }
    //   })
    // ).subscribe(p => this._profile$.next(p));
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
