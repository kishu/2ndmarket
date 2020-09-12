import { forkJoin } from 'rxjs';
import { first } from 'rxjs/operators';
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { Router, RouteReuseStrategy, RouterModule } from '@angular/router';

import { ServiceWorkerModule } from '@angular/service-worker';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule, REGION } from '@angular/fire/functions';

import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { CacheRouteReuseStrategy } from '@app/./cache-route-reuse.strategy';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from '@app/modules/auth/auth.module';
import { GoodsModule } from '@app/modules/goods/goods.module';
import { PreferenceModule } from '@app/modules/preference/preference.module';
import { ComponentsModule } from '@app/modules/components/components.module';
import { SharedModule } from '@app/shared/shared.module';
import { AuthService } from '@app/core/http';
import { ProfileSelectService } from '@app/core/business';

import { environment } from '@environments/environment';
import { AppComponent } from './app.component';

export function appInitializer(router: Router, authService: AuthService) {
  return () => {
    return new Promise(resolve => {
      forkJoin([
        authService.user$.pipe(first()),
        authService.profileExt$.pipe(first())
      ]).subscribe(([u, p]) => {
        if (!u) {
          alert('로그인 해주세요!');
          router.navigate(['/auth/sign-in']);
        } else if (!p) {
          alert('프로필을 설정해 주세요!');
          router.navigate(['/preference', 'groups']);
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
    AppRoutingModule,
    AuthModule,
    GoodsModule,
    PreferenceModule,
    ComponentsModule,
    SharedModule,
    /*
     * angular.json configuration
     * "serviceWorker": true,
     * "ngswConfigPath": "ngsw-config.json"
     */
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    // AngularFirestoreModule,
    AngularFirestoreModule.enablePersistence({ synchronizeTabs: false }),
    AngularFireFunctionsModule,
    /*
     * angular.json options
     * "src/firebase-messaging-sw.js"
     */
    AngularFireMessagingModule
  ],
  providers: [
    { provide: REGION, useValue: 'asia-northeast1' },
    { provide: RouteReuseStrategy, useClass: CacheRouteReuseStrategy },
    { provide: APP_INITIALIZER, useFactory: appInitializer, deps: [Router, AuthService, ProfileSelectService], multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
