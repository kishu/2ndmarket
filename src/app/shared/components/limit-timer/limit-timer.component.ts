import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-limit-timer',
  templateUrl: './limit-timer.component.html',
  styleUrls: ['./limit-timer.component.scss']
})
export class LimitTimerComponent implements OnInit, OnDestroy {
  @Input() time: number;
  @Output() finished = new EventEmitter<null>();

  private timerId: number;

  constructor() { }

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.clearTimer(false);
  }

  startTimer() {
    this.timerId = setInterval(() => {
      this.time = this.time - 1000;
      if ( this.time <= 0 ) {
        this.clearTimer(true);
      }
    }, 1000);
  }

  clearTimer(emit: boolean) {
    clearInterval(this.timerId);
    emit && this.finished.emit();
  }

}
