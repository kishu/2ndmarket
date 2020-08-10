import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-goods-more, [app-goods-more]',
  templateUrl: './goods-more.component.html',
  styleUrls: ['./goods-more.component.scss']
})
export class GoodsMoreComponent implements OnInit {
  @Input() activated = true;
  @Output() more = new EventEmitter<null>();
  protected intersectionObserver: IntersectionObserver;

  constructor(private elRef: ElementRef) {
  }

  ngOnInit(): void {
    const config = {
      rootMargin: '0px 0px 100% 0px ',
      threshold: [0]
    };
    this.intersectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.more.next();
        }
      });
    }, config);

    this.intersectionObserver.observe(this.elRef.nativeElement);
  }

  onClickMore() {
    this.more.emit();
  }

}
