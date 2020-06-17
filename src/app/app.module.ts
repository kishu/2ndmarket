import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule, REGION } from '@angular/fire/functions';

import { environment } from '@environments/environment';
import { HomeModule } from '@app/modules/home/home.module';
import { AuthModule } from '@app/modules/auth/auth.module';
import { GoodsModule } from '@app/modules/goods/goods.module';
import { GroupModule } from '@app/modules/group/group.module';
import { PreferenceModule } from '@app/modules/preference/preference.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

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
    PreferenceModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: REGION, useValue: 'asia-northeast1' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
