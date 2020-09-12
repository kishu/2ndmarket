import { combineLatest } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { NewFcmToken } from '@app/core/model';
import { AuthService, FcmTokensService } from '@app/core/http';
import { CoverService } from '@app/modules/components/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  get path() {
    return this.location.path();
  }

  get cover$() {
    return this.coverService.cover$;
  }

  constructor(
    private router: Router,
    private location: Location,
    private afMessaging: AngularFireMessaging,
    private authService: AuthService,
    private fcmTokensService: FcmTokensService,
    private coverService: CoverService
  ) {
    combineLatest([
      this.authService.profileExt$.pipe(first(), filter(p => !!p)),
      this.afMessaging.requestToken.pipe(first())
    ]).subscribe(
      ([p, t]) => {
        const newToken = {
          profileId: p.id,
          token: t,
          created: FcmTokensService.serverTimestamp()
        } as NewFcmToken;
        return this.fcmTokensService.changeToken(newToken);
      },
      err => {
        console.log(err);
      }
    );

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
    // todo improve
    // i'm not sure this is right way.
    if (!document.referrer && this.location.path()) {
      const pathname = window.location.pathname;
      history.replaceState(null, null, '');
      history.pushState(null, null, pathname);
    }
  }

}
