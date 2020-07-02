import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LimitTimerComponent } from './components';
import { FormatDistanceToNowPipe, FromBytesPipe, FsDocumentPipe, FsTimestampPipe, MsToMMSSPipe, ObjectUrlPipe, SanitizerPipe } from './pipes';
import { ImagesControlComponent } from './components/images-control/images-control.component';

@NgModule({
  declarations: [
    ImagesControlComponent,
    LimitTimerComponent,
    FormatDistanceToNowPipe,
    FromBytesPipe,
    FsDocumentPipe,
    FsTimestampPipe,
    MsToMMSSPipe,
    ObjectUrlPipe,
    SanitizerPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ImagesControlComponent,
    LimitTimerComponent,
    FormatDistanceToNowPipe,
    FromBytesPipe,
    FsDocumentPipe,
    FsTimestampPipe,
    MsToMMSSPipe,
    ObjectUrlPipe,
    SanitizerPipe
  ]
})
export class SharedModule { }
