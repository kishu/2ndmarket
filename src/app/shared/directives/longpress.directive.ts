import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[appLongpress]'
})
export class LongpressDirective implements OnInit, OnDestroy {
  @Output() longpress = new EventEmitter();
  private timerId;

  constructor(
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
    this.elementRef.nativeElement.addEventListener('touchstart', this.handleTouchDown.bind(this));
    this.elementRef.nativeElement.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.elementRef.nativeElement.addEventListener('touchend', this.handleTouchUp.bind(this));
    this.elementRef.nativeElement.addEventListener('mousedown', this.handleTouchDown.bind(this));
    this.elementRef.nativeElement.addEventListener('mousemove', this.handleTouchMove.bind(this));
    this.elementRef.nativeElement.addEventListener('mouseup', this.handleTouchUp.bind(this));
  }

  ngOnDestroy() {
    this.longpress.complete();
    this.elementRef.nativeElement.removeEventListener('touchstart', this.handleTouchDown.bind(this));
    this.elementRef.nativeElement.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    this.elementRef.nativeElement.removeEventListener('touchend', this.handleTouchUp.bind(this));
    this.elementRef.nativeElement.removeEventListener('mousedown', this.handleTouchDown.bind(this));
    this.elementRef.nativeElement.removeEventListener('mousemove', this.handleTouchMove.bind(this));
    this.elementRef.nativeElement.removeEventListener('mouseup', this.handleTouchUp.bind(this));
  }

  handleTouchDown(e) {
    // e.preventDefault();
    this.timerId = setTimeout(() => {
      this.longpress.emit();
    }, 600);
  }

  handleTouchMove(e) {
    // e.preventDefault();
    clearTimeout(this.timerId);
    this.timerId = null;

  }

  handleTouchUp(e) {
    if (this.timerId) {
      e.preventDefault();
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

}
