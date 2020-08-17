import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent, ImagesControlComponent, LimitTimerComponent, ProfileChangeComponent } from './components';
import { SwipeDirective } from './directives';
import { CloudinaryPipe, FormatDistanceToNowPipe, FromBytesPipe, FsDocumentPipe, FsTimestampPipe,
         GoodsConditionPipe, GoodsPurchasedPipe, LinkkfyPipe, MsToMMSSPipe, ObjectUrlPipe, SanitizerPipe } from './pipes';

@NgModule({
  declarations: [
    HeaderComponent,
    ImagesControlComponent,
    LimitTimerComponent,
    ProfileChangeComponent,
    SwipeDirective,
    CloudinaryPipe,
    FormatDistanceToNowPipe,
    FromBytesPipe,
    FsDocumentPipe,
    FsTimestampPipe,
    GoodsConditionPipe,
    GoodsPurchasedPipe,
    LinkkfyPipe,
    MsToMMSSPipe,
    ObjectUrlPipe,
    SanitizerPipe
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    ImagesControlComponent,
    LimitTimerComponent,
    ProfileChangeComponent,
    SwipeDirective,
    CloudinaryPipe,
    FormatDistanceToNowPipe,
    FromBytesPipe,
    FsDocumentPipe,
    FsTimestampPipe,
    GoodsConditionPipe,
    GoodsPurchasedPipe,
    LinkkfyPipe,
    MsToMMSSPipe,
    ObjectUrlPipe,
    SanitizerPipe
  ]
})
export class SharedModule { }
