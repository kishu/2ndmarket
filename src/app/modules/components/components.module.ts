import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { CoverComponent } from './cover/cover.component';
import { HeaderComponent } from './header/header.component';
import { ImagesControlComponent } from './images-control/images-control.component';
import { LimitTimerComponent } from './limit-timer/limit-timer.component';

@NgModule({
  declarations: [
    CoverComponent,
    HeaderComponent,
    ImagesControlComponent,
    LimitTimerComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    CoverComponent,
    HeaderComponent,
    ImagesControlComponent,
    LimitTimerComponent
  ]
})
export class ComponentsModule { }
