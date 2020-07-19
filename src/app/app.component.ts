import { filter, first, switchMap, withLatestFrom } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { AuthService, FcmTokensService } from '@app/core/http';
import { NewFcmToken } from '@app/core/model';

@Component({
  selector: 'app-root, [app-root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private location: Location,
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
      console.log(err);
    });

    // this.afMessaging.onMessage(payload => {
    //   const { body, title, click_action} = payload.notification;
    //   if (!this.location.isCurrentPathEqualTo('/preference/profile')) {
    //     if (confirm(`${title}\n${body}`)) {
    //       const pathname = parse(click_action).pathname;
    //       this.router.navigateByUrl(pathname);
    //     }
    //   }
    // });

    // this.afMessaging.messages.subscribe((message) => { console.log(message); });
  }

  ngOnInit() {
  }

}
