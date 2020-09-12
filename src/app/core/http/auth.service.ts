import { auth } from 'firebase/app';
import { ReplaySubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ProfileExt, User } from '@app/core/model';

enum AuthProvider {
  google = 'google',
  facebook = 'facebook',
  twitter = 'twitter',
  github = 'github'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService  {
  private _user: User;
  get user() { return this._user; }

  private _profile: ProfileExt;
  get profile() { return this._profile; }

  profileExt$ = new ReplaySubject<ProfileExt>(1);
  set selectedProfile(profileExt: ProfileExt) {
    console.log('set selectedProfile', profileExt);
    this._profile = profileExt;
    this.profileExt$.next(profileExt);
  }

  user$ = this.afAuth.user.pipe(
    map(user => user ?
      {
        id: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email
      } as User :
      null
    ),
    tap(u => this._user = u)
  );

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
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
