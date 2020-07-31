import { forkJoin } from 'rxjs';
import { first } from 'rxjs/operators';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule, REGION } from '@angular/fire/functions';
import { AngularFireMessagingModule } from '@angular/fire/messaging';

import { environment } from '@environments/environment';

import { AuthModule } from '@app/modules/auth/auth.module';
import { GoodsModule } from '@app/modules/goods/goods.module';
import { GroupModule } from '@app/modules/group/group.module';
import { PreferenceModule } from '@app/modules/preference/preference.module';

import { AuthService } from '@app/core/http';
import { AppComponent } from './app.component';
import { HeaderComponent } from './modules/header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';

export function appInitializer(router: Router, authService: AuthService) {
  return () => {
    return new Promise(resolve => {
      forkJoin([
        authService.user$.pipe(first()),
        authService.profileExt$.pipe(first()),
      ]).subscribe(([user, profile]) => {
        console.log('appInitializer', user, profile);
        if (!user) {
          alert('로그인해 주세요!');
          router.navigate(['/sign-in']);
        } else if (!profile) {
          alert('프로파일을 등록해 주세요!');
          router.navigate(['/preference', 'groups']);
        } else {
          // router.navigate(['/groups', profile.groupId, 'goods']);
        }
        resolve();
      });
    });
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    // AngularFirestoreModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireFunctionsModule,
    AngularFireMessagingModule,
    AuthModule,
    GoodsModule,
    GroupModule,
    PreferenceModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: REGION, useValue: 'asia-northeast1' },
    { provide: APP_INITIALIZER, useFactory: appInitializer, deps: [Router, AuthService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
