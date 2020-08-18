import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-goods-image-viewer',
  templateUrl: './goods-image-viewer.component.html',
  styleUrls: ['./goods-image-viewer.component.scss']
})
export class GoodsImageViewerComponent implements OnInit {
  @Input() images: string/* image src url */[];
  @ViewChild('scrollEl', { static: true }) scrollElRef: ElementRef;

  selectedIdx = history.state.selectedIdx || 0;
  completed = false;

  constructor(
    private location: Location
  ) {
  }

  ngOnInit(): void {
  }

  onLoadImage(e: Event, selected: boolean) {
    if (selected) {
      const target = e.target as HTMLElement;
      this.scrollElRef.nativeElement.scrollTo(target.offsetLeft, 0);
      setTimeout(() => this.completed = true);
    }
  }

  onSwipeUp() {
    this.location.back();
  }

  onSwipeDown() {
    this.location.back();
  }

  onClickImage() {
    this.location.back();
  }

}
