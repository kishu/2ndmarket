import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { first, map, switchMap, } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { GroupService } from '@app/core/http/group.service';
import { User } from '@app/core/model/user';
import { Group } from '@app/core/model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private _isAdmin: boolean;
  // get isAdmin() { return this._isAdmin;

  private _group$ = new ReplaySubject<Group | null>(1);
  private _user$ = new ReplaySubject<User | null>(1);

  get user$(): Observable<User | null> { return this._user$; }
  get group$(): Observable<Group | null> { return this._group$; }

  constructor(
    private afAuth: AngularFireAuth,
    private groupService: GroupService
  ) {
    // this.afAuth.idTokenResult.subscribe(r => {
    //   if ( r && r.claims && r.claims.admin) {
    //     this._isAdmin = r.claims.admin;
    //   } else {
    //     this._isAdmin = false;
    //   }
    // });

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
      switchMap(u => this.groupService.getByDomain(u.email.split('@')[1]))
    ).subscribe(g => this._group$.next(g));
  }

  sendSignInLinkToEmail(email: string) {
    // https://firebase.google.com/docs/auth/web/email-link-auth
    const actionCodeSettings = {
      url: window.location.origin + '/sign-in-result',
      handleCodeInApp: true
    };
    return this.afAuth.sendSignInLinkToEmail(email, actionCodeSettings)
      .then(() => window.localStorage.setItem('emailForSignIn', email))
      .catch(err => alert(err));
  }

  signInWithEmailLink() {
    const isSignInWithEmilLink = this.afAuth.isSignInWithEmailLink(window.location.href);
    const email = window.localStorage.getItem('emailForSignIn');
    if (isSignInWithEmilLink && email) {
      window.localStorage.removeItem('emailForSignIn');
      return this.afAuth.signInWithEmailLink(email, window.location.href).catch(err => alert(err));
    } else {
      return Promise.reject();
    }
  }

  signOut() {
    return this.afAuth.signOut();
  }
}
