import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';


@Directive({
  selector: '[appSwipe]'
})
export class SwipeDirective implements OnInit, OnDestroy {
  @Output() swipeup = new EventEmitter();
  @Output() swipedown = new EventEmitter();
  private sX = 0;
  private sY = 0;

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.elementRef.nativeElement.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  ngOnDestroy() {
    this.swipeup.complete();
    this.swipedown.complete();
    this.elementRef.nativeElement.removeEventListener('touchstart', this.handleTouchStart);
    this.elementRef.nativeElement.removeEventListener('touchend', this.handleTouchEnd);
  }

  handleTouchStart(e) {
    e.stopImmediatePropagation();
    this.sX = e.changedTouches[0].screenX;
    this.sY = e.changedTouches[0].screenY;
  }

  handleTouchEnd(e) {
    e.stopImmediatePropagation();
    const dX = e.changedTouches[0].screenX - this.sX;
    const dY = e.changedTouches[0].screenY - this.sY;
    const rX = Math.abs(dX / dY);
    const rY = Math.abs(dY / dX);

    if (Math.abs(rX > rY ? dX : dY) < 30) {
      return;
    }

    if (rX > rY) {
      if (dX >= 0) {
        // swiperight;
      } else {
        // swipeleft;
      }
    } else {
      if (dY >= 0) {
        this.swipedown.emit();
      } else {
        this.swipeup.emit();
      }
    }
  }

}
