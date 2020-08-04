import { once } from 'lodash-es';
import { combineLatest, forkJoin, merge, Observable, of, Subject } from 'rxjs';
import { filter, first, map, shareReplay, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, HostBinding, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationEvent, animate, state, style, transition, trigger } from '@angular/animations';
import { AuthService, GoodsService, FavoriteGoodsService, GroupsService, ProfilesService } from '@app/core/http';
import { GoodsCacheService } from '@app/core/persistence';
import { Goods, NewFavoriteGoods } from '@app/core/model';
import { HeaderService } from '@app/shared/services';

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
  @HostBinding('class.hidden-after') hiddenAfter = true;
  @ViewChild('goodsNameRef', { read: ElementRef }) goodsNameRef: ElementRef;
  private intersectionObserver: IntersectionObserver;
  private initIntersectionObserverOnce = once(this.initIntersectionObserver);
  private destroy$ = new Subject<null>();

  goods$: Observable<Goods> = merge(
    this.goodsCacheService.getCachedGoods$(this.goodsId).pipe(filter(g => !!g)),
    this.goodsService.valueChanges(this.goodsId).pipe(
      takeUntil(this.destroy$)
    )
  ).pipe(
    shareReplay(1)
  );

  empty$: Observable<boolean> = this.goods$.pipe(first(), map(g => !g));
  permission$: Observable<boolean> = combineLatest([
    this.goods$,
    this.authService.profileExt$
  ]).pipe(
    map(([g, p]) => g.profileId === p?.id),
    shareReplay(1)
  );
  favoriteCount$: Observable<number> = this.goods$.pipe(
    first(),
    map(goods => goods.favoritesCnt)
  );
  favorited$: Observable<boolean> = combineLatest([
    this.goods$,
    this.authService.profileExt$
  ]).pipe(
    switchMap(([g, p]) => this.goodsFavoritesService.getQueryByGoodsIdAndProfileId(g.id, p.id)),
    map(f => f.length > 0),
    shareReplay(1)
  );
  showPermission = false;
  showPhotoViewer = false;

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
    private goodsFavoritesService: FavoriteGoodsService,
    private headerService: HeaderService
  ) {
  }

  ngOnInit(): void {
  }

  onClickPermission() {
    this.showPermission = !this.showPermission;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.goodsCacheService.remove();
    if (this.goodsNameRef) {
      this.intersectionObserver.unobserve(this.goodsNameRef.nativeElement);
      this.headerService.title$.next(null);
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
          this.goods$.pipe(first()).subscribe((g) => this.headerService.title$.next(g.name));
        } else if (entry.isIntersecting && entry.boundingClientRect.top <= 0) {
          this.headerService.title$.next(null);
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
        .navigate(['../'], { replaceUrl: true, relativeTo: this.activatedRoute })
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

  onClickPhotoViewer() {
    this.showPhotoViewer = !this.showPhotoViewer;
  }

  onClickHistoryBack() {
    this.location.back();
  }

}
