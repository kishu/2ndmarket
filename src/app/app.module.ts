import { first } from 'rxjs/operators';

import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { Router, RouteReuseStrategy, RouterModule } from '@angular/router';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule, REGION } from '@angular/fire/functions';
import { AngularFireMessagingModule } from '@angular/fire/messaging';

import { environment } from '@environments/environment';

import { AuthModule } from '@app/modules/auth/auth.module';
import { GoodsModule } from '@app/modules/goods/goods.module';
import { PreferenceModule } from '@app/modules/preference/preference.module';
import { SharedModule } from '@app/shared/shared.module';

import { AuthService } from '@app/core/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CacheRouteReuseStrategy } from '@app/./cache-route-reuse.strategy';

export function appInitializer(router: Router, authService: AuthService) {
  return () => {
    return new Promise(resolve => {
      authService.user$.pipe(first()).subscribe(user => {
        console.log('appInitializer', user);
        if (!user) {
          alert('로그인해 주세요!');
          router.navigate(['/sign-in']);
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
    RouterModule,
    BrowserModule,
    RouterModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    AngularFirestoreModule,
    // AngularFirestoreModule.enablePersistence(),
    AngularFireFunctionsModule,
    /*
     * angular.json options
     * "src/firebase-messaging-sw.js"
     */
    // AngularFireMessagingModule,
    AuthModule,
    GoodsModule,
    PreferenceModule,
    SharedModule,
    AppRoutingModule,
    /*
     * angular.json configuration
     * "serviceWorker": true,
     * "ngswConfigPath": "ngsw-config.json"
     * "src/firebase-messaging-sw.js"
     */
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: REGION, useValue: 'asia-northeast1' },
    { provide: RouteReuseStrategy, useClass: CacheRouteReuseStrategy },
    { provide: APP_INITIALIZER, useFactory: appInitializer, deps: [Router, AuthService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
