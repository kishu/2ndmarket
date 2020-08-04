import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent, ImagesControlComponent, LimitTimerComponent, ProfileChangeComponent } from './components';
import { FormatDistanceToNowPipe, FromBytesPipe, FsDocumentPipe, FsTimestampPipe, LinkkfyPipe,
         MsToMMSSPipe, ObjectUrlPipe, SanitizerPipe } from './pipes';

@NgModule({
  declarations: [
    HeaderComponent,
    ImagesControlComponent,
    LimitTimerComponent,
    ProfileChangeComponent,
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
    HeaderComponent,
    ImagesControlComponent,
    LimitTimerComponent,
    ProfileChangeComponent,
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
