import { once } from 'lodash-es';
import { BehaviorSubject, combineLatest, concat, forkJoin, Observable, of, Subject } from 'rxjs';
import { filter, first, map, shareReplay, switchMap, takeUntil } from 'rxjs/operators';
import { Location } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationEvent, animate, state, style, transition, trigger } from '@angular/animations';
import { AuthService, GoodsService, FavoriteGoodsService, GroupsService, ProfilesService } from '@app/core/http';
import { GoodsCacheService } from '@app/core/persistence';
import { Goods, NewFavoriteGoods } from '@app/core/model';

@Component({
  selector: 'app-goods-detail, [app-goods-detail]',
  templateUrl: './goods-detail.component.html',
  styleUrls: ['./goods-detail.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        display: 'block',
      })),
      state('closed', style({
        display: 'none',
      })),
      transition('open => closed', [
        animate('0.1s')
      ]),
      transition('closed => open', [
        animate('0s')
      ]),
    ]),
  ]
})
export class GoodsDetailComponent implements OnInit, OnDestroy, AfterViewChecked {
  scrollY: number;
  intersected = false;

  @ViewChild('goodsNameRef', { static: true, read: ElementRef }) goodsNameRef: ElementRef;
  private intersectionObserver: IntersectionObserver;
  private initIntersectionObserverOnce = once(this.initIntersectionObserver);
  private destroy$ = new Subject<null>();

  heroImageLoaded$ = new BehaviorSubject<boolean>(false);

  goods$: Observable<Goods> = concat(
    this.goodsCacheService.getCachedGoods$(this.goodsId).pipe(filter(g => !!g)),
    this.goodsService.valueChanges(this.goodsId).pipe(takeUntil(this.destroy$))
  ).pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );

  empty$: Observable<boolean> = this.goods$.pipe(first(), map(g => !g));
  permission$: Observable<boolean> = combineLatest([
    this.goods$,
    this.authService.profileExt$
  ]).pipe(
    map(([g, p]) => g.profileId === p?.id),
    shareReplay({ bufferSize: 1, refCount: true })
  );
  favoriteCount$: Observable<number> = this.goods$.pipe(
    first(),
    map(goods => goods.favoritesCnt),
    shareReplay({ bufferSize: 1, refCount: true })
  );
  favorited$: Observable<boolean> = combineLatest([
    this.goods$,
    this.authService.profileExt$
  ]).pipe(
    switchMap(([g, p]) => this.goodsFavoritesService.getQueryByGoodsIdAndProfileId(g.id, p.id)),
    map(f => f.length > 0),
    shareReplay({ bufferSize: 1, refCount: true })
  );
  showPermission = false;

  goodsImage$ = this.activatedRoute.queryParamMap.pipe(
    map(m => parseInt(m.get('image'), 10))
  );

  private get goodsId() {
    return this.activatedRoute.snapshot.paramMap.get('goodsId');
  }

  constructor(
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private groupService: GroupsService,
    private profilesService: ProfilesService,
    private goodsService: GoodsService,
    private goodsCacheService: GoodsCacheService,
    private goodsFavoritesService: FavoriteGoodsService
  ) {
  }

  ngOnInit(): void {
  }

  onClickPermission() {
    this.showPermission = !this.showPermission;
  }

  onLoadHeroImage() {
    this.heroImageLoaded$.next(true);
    this.heroImageLoaded$.complete();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.goodsCacheService.remove();
    if (this.goodsNameRef) {
      this.intersectionObserver.unobserve(this.goodsNameRef.nativeElement);
    }
  }

  ngAfterViewChecked() {
    if (this.goodsNameRef) {
      this.initIntersectionObserverOnce();
    }
  }

  private initIntersectionObserver() {
    const config = {
      rootMargin: '0px',
      threshold: [0]
    };
    this.intersectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && entry.boundingClientRect.top <= 0) {
          this.intersected = true;
        } else if (entry.isIntersecting && entry.boundingClientRect.top <= 0) {
          this.intersected = false;
        }
      });
    }, config);

    this.intersectionObserver.observe(this.goodsNameRef.nativeElement);
  }

  onClickSoldOut() {
    const goodsId = this.goodsId;
    this.goodsService.get(goodsId).pipe(
      first(),
      filter(g => !!g),
      map(g => !!g.soldOut),
      switchMap(soldOut => this.goodsService.updateSoldOut(goodsId, !soldOut))
    ).subscribe(
      () => {},
      err => alert(err)
    );
    this.showPermission = false;
  }

  onClickFavorite() {
    const goodsId = this.goodsId;
    const addGoodsFavorite$ = forkJoin([
      this.authService.user$.pipe(first(), filter(u => !!u)),
      this.authService.profileExt$.pipe(first(), filter(p => !!p))
    ]).pipe(
      switchMap(([u, p]) => {
        return this.goodsFavoritesService.add({
          userId: u.id,
          profileId: p.id,
          goodsId,
          created: FavoriteGoodsService.serverTimestamp()
        } as NewFavoriteGoods);
      })
    );
    const deleteGoodsFavorite$ = forkJoin([
      this.authService.profileExt$.pipe(first(), filter(p => !!p))
    ]).pipe(
      switchMap(([p]) => this.goodsFavoritesService.deleteByGoodsIdAndProfileId(goodsId, p.id))
    );

    forkJoin([
      this.favorited$.pipe(first()),
      this.favoriteCount$.pipe(first()),
      this.permission$.pipe(first())
    ]).pipe(
      switchMap(([favorited, favoriteCount, permission]) => {
        if (permission) {
          return of(null);
        } else {
          this.favorited$ = of(!favorited);
          this.favoriteCount$ = of(favoriteCount + (favorited ? -1 : 1));
          return favorited ? deleteGoodsFavorite$ : addGoodsFavorite$;
        }
      })
    ).subscribe(
      () => {},
      err => alert(err)
    );
  }

  onClickDelete(goods: Goods) {
    if (confirm('삭제 할까요?')) {
      this.router
        .navigate(['/', 'goods'], { replaceUrl: true, relativeTo: this.activatedRoute })
        .then(() => {
          return this.goodsService.moveToTrash(goods);
        })
        .then(
          () => {},
          (err) => alert(err)
        );
    }
  }

  onAnimationStart(event: AnimationEvent) {
    if (event.toState === 'open') {
      this.scrollY = window.scrollY;
      (document.querySelector('.wrap') as HTMLElement).classList.add('fixed');
      (document.querySelector('.wrap') as HTMLElement).style.top = `${0 - this.scrollY}px`;
    }
  }

  onAnimationDone(event: AnimationEvent) {
    if (event.toState === 'closed') {
      (document.querySelector('.wrap') as HTMLElement).classList.remove('fixed');
      (document.querySelector('.wrap') as HTMLElement).style.top = '';
      window.scrollTo(0, this.scrollY);
    }
  }

  onClickHistoryBack() {
    this.location.back();
  }

  test(e: Event) {
    // e.preventDefault();

    // do something

    e.stopPropagation();
    this.router.navigate(['./images'], { relativeTo: this.activatedRoute });

    return;
  }

}
