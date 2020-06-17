import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LimitTimerComponent } from './components';
import { FormatDistanceToNowPipe, FsTimestampPipe, MsToMMSSPipe } from './pipes';
import { PasswordValidatorDirective } from './validators';

@NgModule({
  declarations: [
    LimitTimerComponent,
    FormatDistanceToNowPipe,
    FsTimestampPipe,
    MsToMMSSPipe,
    PasswordValidatorDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LimitTimerComponent,
    FormatDistanceToNowPipe,
    FsTimestampPipe,
    MsToMMSSPipe,
    PasswordValidatorDirective
  ]
})
export class SharedModule { }
