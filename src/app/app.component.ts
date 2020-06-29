import { filter, first, mergeMap, mergeMapTo, switchMap, withLatestFrom } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { AuthService, FcmTokensService } from '@app/core/http';
import { NewFcmToken } from '@app/core/model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private afMessaging: AngularFireMessaging,
    private authService: AuthService,
    private fcmTokensService: FcmTokensService
  ) {
    this.afMessaging.requestToken.pipe(
      withLatestFrom(this.authService.profile$.pipe(first(), filter(p => !!p))),
      switchMap(([token, profile]) => {
        const newToken = {
          profileId: profile.id,
          token,
          created: FcmTokensService.serverTimestamp()
        } as NewFcmToken;
        return this.fcmTokensService.changeToken(newToken);
      })
    ).subscribe((token) => {
    }, err => {
      alert(err);
    });

    this.afMessaging.onMessage((payload) => {
      console.log(payload);
    });

    // this.afMessaging.messages.subscribe((message) => { console.log(message); });
  }

  ngOnInit() {
  }

}
