import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-limit-timer',
  templateUrl: './limit-timer.component.html',
  styleUrls: ['./limit-timer.component.scss']
})
export class LimitTimerComponent implements OnInit, OnDestroy {
  @Input() readonly time: number;
  @Input() set reset$(reset$) {
    if (this.resetSubscription) {
      return;
    }
    this.resetSubscription = reset$.subscribe(reset => {
      if (reset) {
        this.clearTimer(false);
        this.startTimer();
      }
    });
  }
  @Output() timeover = new EventEmitter<null>();

  remainTime: number;
  private timerId: number;
  private resetSubscription: Subscription;

  constructor() { }

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.resetSubscription.unsubscribe();
    this.clearTimer(false);
  }

  startTimer() {
    if (this.timerId) {
      return;
    }
    this.remainTime = this.time;
    this.timerId = setInterval(() => {
      this.remainTime = this.remainTime - 1000;
      if ( this.time <= 0 ) {
        this.remainTime = 0;
        this.clearTimer(true);
      }
    }, 1000);
  }

  clearTimer(emit: boolean) {
    clearInterval(this.timerId);
    this.timerId = undefined;
    if (emit) {
      this.timeover.emit();
    }
  }

}
