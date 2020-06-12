import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordValidatorDirective } from '@app/shared/validator/password-validator.directive';
import { LimitTimerComponent } from './components/limit-timer/limit-timer.component';
import { MsToMMSSPipe } from './pipes/ms-to-mmss.pipe';

@NgModule({
  declarations: [
    PasswordValidatorDirective,
    LimitTimerComponent,
    MsToMMSSPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PasswordValidatorDirective,
    LimitTimerComponent
  ]
})
export class SharedModule { }
