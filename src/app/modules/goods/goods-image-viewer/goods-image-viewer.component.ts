import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-goods-image-viewer',
  templateUrl: './goods-image-viewer.component.html',
  styleUrls: ['./goods-image-viewer.component.scss']
})
export class GoodsImageViewerComponent implements OnInit {
  @Input() images: string/* image src url */[];
  @Input() selectedIdx: number;
  @Output() exit = new EventEmitter();
  @ViewChild('scrollEl', { static: true }) scrollElRef: ElementRef;

  completed = false;

  constructor() { }

  ngOnInit(): void {
  }

  onLoadImage(e: Event, selected: boolean) {
    if (selected) {
      const target = e.target as HTMLElement;
      this.scrollElRef.nativeElement.scrollTo(target.offsetLeft, 0);
      setTimeout(() => this.completed = true);
    }
  }

  onClickImage() {
    this.exit.emit();
  }

}
