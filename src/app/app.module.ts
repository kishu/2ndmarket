import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule, REGION } from '@angular/fire/functions';

import { environment } from '@environments/environment';
import { CustomRouteReuseStrategy } from '@app/./custom-route-reuse-strategy';

import { HomeModule } from '@app/modules/home/home.module';
import { AuthModule } from '@app/modules/auth/auth.module';
import { GoodsModule } from '@app/modules/goods/goods.module';
import { GroupModule } from '@app/modules/group/group.module';
import { UserModule } from '@app/modules/user/user.module';

import { AuthService } from '@app/core/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { first } from 'rxjs/operators';

export function appInitializer(authService: AuthService) {
  return () => {
    return new Promise(resolve => {
      authService.user$.pipe(first()).subscribe(() => resolve());
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
    HomeModule,
    AuthModule,
    GoodsModule,
    GroupModule,
    UserModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: REGION, useValue: 'asia-northeast1' },
    { provide: APP_INITIALIZER, useFactory: appInitializer, deps: [AuthService], multi: true },
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
