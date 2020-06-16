import { Observable, ReplaySubject } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { auth } from 'firebase/app';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { GroupService } from '@app/core/http/group.service';
import { User } from '@app/core/model';
import { Group } from '@app/core/model';

enum AuthProvider {
  google = 'google',
  facebook = 'facebook',
  twitter = 'twitter'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _group$ = new ReplaySubject<Group | null>(1);
  private _user$ = new ReplaySubject<User | null>(1);

  get user$(): Observable<User | null> { return this._user$; }
  get group$(): Observable<Group | null> { return this._group$; }

  constructor(
    private afAuth: AngularFireAuth,
    private groupService: GroupService
  ) {
    const user$ = this.afAuth.user.pipe(
      map(u => {
        if (u) {
          const { uid, displayName, photoURL, email, emailVerified } = u;
          return { id: uid, displayName, photoURL, email, emailVerified };
        } else {
          return null;
        }
      })
    );

    user$.subscribe(u => this._user$.next(u));

    user$.pipe(
      filter(u => !!u),
      switchMap(u => this.groupService.getByDomain(u.email.split('@')[1]))
    ).subscribe(g => this._group$.next(g));

    user$.pipe(
      filter(u => !u),
    ).subscribe(g => this._group$.next(null));
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

  signInWithPopup(provider: string) {
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
    return this.afAuth.signInWithPopup(authProvider);
  }

  getRedirectResult() {
    return this.afAuth.getRedirectResult();
  }

  createUserWithEmailAndPassword(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  sendEmailVerification() {
    return this.afAuth.currentUser.then(u => u.sendEmailVerification());
  }

  sendSignInLinkToEmail(email: string, signInEmailId: string) {
    // https://firebase.google.com/docs/auth/web/email-link-auth
    const settings = {
      url: `${window.location.origin}/sign-in-result?ref=${signInEmailId}`,
      handleCodeInApp: true
    };
    console.log('settings', settings);
    return this.afAuth.sendSignInLinkToEmail(email, settings).catch(err => alert(err));
  }

  signInWithEmailLink(signInEmail: string, signInEmailId: string) {
    console.log(`${window.location.origin}/sign-in-result?ref=${signInEmailId}`);
    return this.afAuth.signInWithEmailLink(signInEmail, `${window.location.origin}/sign-in-result?ref=${signInEmailId}`);
    // const isSignInWithEmilLink = this.afAuth.isSignInWithEmailLink(window.location.href);
    // if (isSignInWithEmilLink) {
    //   return this.afAuth.signInWithEmailLink(signInEmail, window.location.href).catch(err => alert(err));
    // } else {
    //   return Promise.reject();
    // }
  }

  signOut() {
    return this.afAuth.signOut();
  }
}
