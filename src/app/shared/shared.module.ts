import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ImagesControlComponent, LimitTimerComponent } from './components';
import { FormatDistanceToNowPipe, FromBytesPipe, FsDocumentPipe, FsTimestampPipe, LinkkfyPipe,
         MsToMMSSPipe, ObjectUrlPipe, SanitizerPipe } from './pipes';

@NgModule({
  declarations: [
    ImagesControlComponent,
    LimitTimerComponent,
    FormatDistanceToNowPipe,
    FromBytesPipe,
    FsDocumentPipe,
    FsTimestampPipe,
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
    ImagesControlComponent,
    LimitTimerComponent,
    FormatDistanceToNowPipe,
    FromBytesPipe,
    FsDocumentPipe,
    FsTimestampPipe,
    LinkkfyPipe,
    MsToMMSSPipe,
    ObjectUrlPipe,
    SanitizerPipe
  ]
})
export class SharedModule { }
