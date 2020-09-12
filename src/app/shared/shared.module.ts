import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LongpressDirective, SwipeDirective } from './directives';
import { CloudinaryPipe, FormatDistanceToNowPipe, FromBytesPipe, FsDocumentPipe, FsTimestampPipe,
         GoodsConditionPipe, GoodsPurchasedPipe, LinkifyPipe, MsToMMSSPipe, ObjectUrlPipe, SanitizerPipe } from './pipes';

@NgModule({
  declarations: [
    LongpressDirective,
    SwipeDirective,
    CloudinaryPipe,
    FormatDistanceToNowPipe,
    FromBytesPipe,
    FsDocumentPipe,
    FsTimestampPipe,
    GoodsConditionPipe,
    GoodsPurchasedPipe,
    LinkifyPipe,
    MsToMMSSPipe,
    ObjectUrlPipe,
    SanitizerPipe
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    LongpressDirective,
    SwipeDirective,
    CloudinaryPipe,
    FormatDistanceToNowPipe,
    FromBytesPipe,
    FsDocumentPipe,
    FsTimestampPipe,
    GoodsConditionPipe,
    GoodsPurchasedPipe,
    LinkifyPipe,
    MsToMMSSPipe,
    ObjectUrlPipe,
    SanitizerPipe
  ]
})
export class SharedModule { }
