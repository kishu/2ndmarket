import { auth } from 'firebase/app';
import { of, ReplaySubject, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AccountsService } from '@app/core/http/accounts.service';
import { ProfileExt, User, Profile2, ProfileExt2, AccountExt } from '@app/core/model';

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

  private _account: AccountExt;
  get account() { return this._account; }

  profileExt$ = new ReplaySubject<ProfileExt>(1);
  set selectedProfile(profileExt: ProfileExt) {
    // this._profile = profileExt;
    // this.profileExt$.next(profileExt);
  }

  user$ = new Subject<User | null>();
  userSubscription = this.afAuth.user.pipe(
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
    console.log('user', user);
    this._user = user;
    this.user$.next(user);
  });

  account$ = new Subject<AccountExt | null>();
  accountSubscription = this.user$.pipe(
    switchMap(user => user ? this.accountService.getQueryByUserId(user.id) : of(null))
  ).subscribe(account => {
    console.log('subsubsub');
    this._account = account;
    console.log('account', account);
    this.account$.next(account);
  });

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private accountService: AccountsService
  ) {
  }

  ngOnDestroy() {
    this.account$.complete();
    this.user$.complete();

    this.accountSubscription.unsubscribe();
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
