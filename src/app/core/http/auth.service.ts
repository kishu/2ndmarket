import auth from 'firebase/firebase-auth';
import { merge, of, ReplaySubject, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ProfileExt, User, Profile2 } from '@app/core/model';
import { MembershipExt } from '@app/core/model/membership';
import { MembershipsService } from '@app/core/http/memberships.service';

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
  private _user: User;
  get user() { return this._user; }

  private _profile: ProfileExt;
  get profile() { return this._profile; }

  private _membership: MembershipExt;
  get membership() { return this._membership; }

  profileExt$ = new ReplaySubject<ProfileExt>(1);
  set selectedProfile(profileExt: ProfileExt) {
    // this._profile = profileExt;
    // this.profileExt$.next(profileExt);
  }

  user$ = new ReplaySubject<User | null>(1);
  private userSubscription = this.afAuth.user.pipe(
    map(user =>  user ?
      {
        id: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email
      } as User :
      null
    ),
  ).subscribe(user => {
    console.log('AuthService User', user);
    this._user = user;
    this.user$.next(user);
  });

  membership$ = new ReplaySubject<MembershipExt | null>(1);
  changeMembership$ = new Subject<null>();
  private membershipSubscription = merge(
    this.user$.pipe(map(user => user?.id)),
    this.changeMembership$.pipe(map(() => this.user?.id))
  ).pipe(
    switchMap(userId => userId ? this.membershipService.getActivatedByUserId(userId) : of(null))
  ).subscribe(membership => {
    this._membership = membership;
    this.membership$.next(membership);
  });

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private membershipService: MembershipsService
  ) {
  }

  ngOnDestroy() {
    this.membership$.complete();
    this.user$.complete();

    this.membershipSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
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
