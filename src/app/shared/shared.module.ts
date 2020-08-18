import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent, ImagesControlComponent, LimitTimerComponent, ProfileChangeComponent } from './components';
import { LongpressDirective, SwipeDirective } from './directives';
import { CloudinaryPipe, FormatDistanceToNowPipe, FromBytesPipe, FsDocumentPipe, FsTimestampPipe,
         GoodsConditionPipe, GoodsPurchasedPipe, LinkkfyPipe, MsToMMSSPipe, ObjectUrlPipe, SanitizerPipe } from './pipes';

@NgModule({
  declarations: [
    HeaderComponent,
    ImagesControlComponent,
    LimitTimerComponent,
    ProfileChangeComponent,
    LongpressDirective,
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
    LongpressDirective,
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
