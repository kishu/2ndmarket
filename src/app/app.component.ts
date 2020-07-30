import { filter, first, switchMap, withLatestFrom } from 'rxjs/operators';
import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { AuthService, FcmTokensService } from '@app/core/http';
import { NewFcmToken } from '@app/core/model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  scrollY: number;
  @ViewChild('wrapRef', {static: true}) wrapRef: ElementRef;
  constructor(
    private router: Router,
    private location: Location,
    private afMessaging: AngularFireMessaging,
    private authService: AuthService,
    private fcmTokensService: FcmTokensService,
    private renderer: Renderer2,
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

  onOpen(event) {
    if (event.phaseName === 'start') {
      this.scrollY = window.scrollY;
      this.renderer.addClass(this.wrapRef.nativeElement, 'fixed');
      this.renderer.setStyle(this.wrapRef.nativeElement, 'top', `${0 - this.scrollY}px`);
    }
  }

  onClose(event) {
    if (event.phaseName === 'done') {
      this.renderer.removeClass(this.wrapRef.nativeElement, 'fixed');
      this.renderer.removeStyle(this.wrapRef.nativeElement, 'top');
      window.scrollTo(0, this.scrollY);
    }
  }
}
