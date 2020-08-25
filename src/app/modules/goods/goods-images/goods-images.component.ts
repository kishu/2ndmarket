import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-goods-images',
  templateUrl: './goods-images.component.html',
  styleUrls: ['./goods-images.component.scss']
})
export class GoodsImagesComponent implements OnInit {
  @Input() images: string/* image src url */[];
  @Input() selected: number;
  @ViewChild('scrollEl', { static: true }) scrollElRef: ElementRef;

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
