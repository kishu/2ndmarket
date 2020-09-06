import { auth } from 'firebase/app';
import { combineLatest, forkJoin, Observable, of, ReplaySubject } from 'rxjs';
import { filter, map, publish, publishLast, refCount, shareReplay, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ProfileExt, User } from '@app/core/model';
import { GroupsService } from '@app/core/http/groups.service';
import { ProfilesService } from '@app/core/http/profiles.service';
import { ProfileSelectService } from '@app/core/util';

enum AuthProvider {
  google = 'google',
  facebook = 'facebook',
  twitter = 'twitter',
  github = 'github'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  user$: Observable<User | null> = this.afAuth.user.pipe(
    map(user => user ?
      {
        id: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email
      } as User :
      null
    ),
    tap(u => console.log('u', u)),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  profileExt$: Observable<ProfileExt | null> = combineLatest([
    this.user$.pipe(tap(t => console.log(1, t))),
    this.selectProfileService.profileId$.pipe(tap(t => console.log(2, t)))
  ]).pipe(
    tap(t => console.log('profileExt$', t)),
    switchMap(([user, profileId]) => {
      if (user === null || profileId === null) {
        return of(null);
      } else {
        return this.profilesService.getQueryByUserId(user.id).pipe(
          switchMap(profiles => {
            return forkJoin(
              profiles.map(profile => this.groupsService.get(profile.groupId))
            ).pipe(
              map(groups => profiles.map((profile, i) => ({...profile, group: groups[i]} as ProfileExt)))
            );
          }),
          map(profileExts => profileExts.find(p => p.id === profileId))
        );
      }
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  constructor(
    private afAuth: AngularFireAuth,
    private groupsService: GroupsService,
    private profilesService: ProfilesService,
    private selectProfileService: ProfileSelectService,
  ) {
  }

  ngOnDestroy() {
    // this.profileSubscription.unsubscribe();
    // this.profileExt$.complete();
    // this.profileExts$.complete();
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
      case AuthProvider.github:
        authProvider = new auth.GithubAuthProvider();
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
