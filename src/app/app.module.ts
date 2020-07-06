import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { Router, RouteReuseStrategy } from '@angular/router';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule, REGION } from '@angular/fire/functions';
import { AngularFireMessagingModule } from '@angular/fire/messaging';

import { environment } from '@environments/environment';
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy';

import { HomeModule } from '@app/modules/home/home.module';
import { AuthModule } from '@app/modules/auth/auth.module';
import { GoodsModule } from '@app/modules/goods/goods.module';
import { PreferenceModule } from '@app/modules/preference/preference.module';

import { AuthService } from '@app/core/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { first } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

export function appInitializer(router: Router, authService: AuthService) {
  return () => {
    return new Promise(resolve => {
      combineLatest([
        authService.user$,
        authService.profile$
      ]).pipe(
        first()
      ).subscribe(([user, profile]) => {
        console.log('appInitializer', user, profile);
        if (!user) {
          alert('로그인해 주세요!');
          router.navigate(['/sign-in']);
        } else if (!profile) {
          alert('프로파일을 등록해 주세요!');
          router.navigate(['/preference', 'profile']);
        }
        resolve();
      });
    });
  };
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    AngularFirestoreModule,
    AngularFireFunctionsModule,
    AngularFireMessagingModule,
    HomeModule,
    AuthModule,
    GoodsModule,
    PreferenceModule,
    AppRoutingModule
  ],
  providers: [
    { provide: REGION, useValue: 'asia-northeast1' },
    { provide: APP_INITIALIZER, useFactory: appInitializer, deps: [Router, AuthService], multi: true },
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
