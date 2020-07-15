import { last, once } from 'lodash-es';
import { BehaviorSubject, combineLatest, forkJoin } from 'rxjs';
import { filter, first, map, scan, shareReplay, switchMap } from 'rxjs/operators';
import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, GoodsService, } from '@app/core/http';
import { GoodsCacheService, PersistenceService } from '@app/core/persistence';
import { Goods } from '@app/core/model';

@Component({
  selector: 'app-goods-list',
  templateUrl: './goods-list.component.html',
  styleUrls: ['./goods-list.component.scss']
})
export class GoodsListComponent implements OnInit, AfterViewChecked {
  @ViewChild('moreRef', { read: ElementRef }) moreRef: ElementRef;

  private fetchingMore = false;
  private moreObserver: IntersectionObserver;
  private initIntersectionObserverOnce = once(this.initIntersectionObserver);

  activatedRouterOutlet = false;
  moreGoods$ = new BehaviorSubject<Goods[] | null>([]);
  goodsList$ = combineLatest([
    this.persistenceService.goods$.pipe(first(), shareReplay(1)),
    this.moreGoods$.pipe(filter(goods => goods !== null), scan((acc, curr) => acc.concat(curr)))
  ]).pipe(
    map(([persistenceGoods, moreGoods]) => persistenceGoods.concat(moreGoods)),
    shareReplay(1)
  );

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private goodsService: GoodsService,
    private goodsCacheService: GoodsCacheService,
    private persistenceService: PersistenceService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewChecked() {
    if (this.moreRef) {
      this.initIntersectionObserverOnce();
    }
  }

  private initIntersectionObserver() {
    const config = {
      rootMargin: '0px 0px 50% 0px ',
      threshold: [0]
    };
    this.moreObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.more();
        }
      });
    }, config);

    this.moreObserver.observe(this.moreRef.nativeElement);
  }

  more() {
    if (this.fetchingMore) {
      return;
    }

    this.fetchingMore = true;
    forkJoin([
      this.authService.profile$.pipe(first(), filter(p => !!p)),
      this.goodsList$.pipe(first())
    ]).pipe(
      switchMap(([profile, goodsList]) => {
        const startAfter = last(goodsList).updated;
        return this.goodsService.getQueryByGroupId(profile.groupId, { startAfter, limit: 5 });
      })
    ).subscribe(goodsList => {
      this.fetchingMore = false;
      if (goodsList.length > 0) {
        this.moreGoods$.next(goodsList);
      } else {
        this.moreObserver.unobserve(this.moreRef.nativeElement);
        this.moreGoods$.next(null);
      }
    });
  }

  onActivatedRouterOutlet() {
    this.activatedRouterOutlet = true;
    this.changeDetectorRef.detectChanges();
  }

  onDeactivatedRouterOutlet() {
    this.activatedRouterOutlet = false;
    this.changeDetectorRef.detectChanges();
  }

  onClickGoods(e: Event, goods: Goods) {
    e.preventDefault();
    this.goodsCacheService.cache(goods);
  }

  onClickMore() {
    this.more();
  }

}
