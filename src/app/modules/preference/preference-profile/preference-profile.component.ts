import { BehaviorSubject, of } from 'rxjs';
import { filter, first, map, shareReplay, switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AuthService, GoodsFavoritesService, GoodsService, NoticesService } from '@app/core/http';
import { Notice } from '@app/core/model';

enum GoodsListType {
  write = 'write',
  favorite = 'favorite'
}

@Component({
  selector: 'app-preference-profile, [app-preference-profile]',
  templateUrl: './preference-profile.component.html',
  styleUrls: ['./preference-profile.component.scss']
})
export class PreferenceProfileComponent implements OnInit {
  profile$ = this.authService.profile$.pipe(first(), filter(p => !!p), shareReplay());
  noticeList$ = this.profile$.pipe(
    switchMap(p => this.noticesService.valueChangesQueryByProfileId(p.id))
  );
  writeGoodsList$ = this.profile$.pipe(
    switchMap(p => this.goodsService.getQueryByProfileId(p.id))
  );
  goodsFavoriteList$ = this.profile$.pipe(
    switchMap(p => this.goodsFavoriteService.getQueryByProfileId(p.id))
  );
  goodsListType$ = new BehaviorSubject<GoodsListType>(GoodsListType.write);

  constructor(
    private authService: AuthService,
    private goodsService: GoodsService,
    private goodsFavoriteService: GoodsFavoritesService,
    private noticesService: NoticesService,
  ) {
  }

  ngOnInit(): void {
  }

  trackById(index, item) {
    return item.id;
  }

  onClickGoodsListType(type: string) {
    this.goodsListType$.next(type as GoodsListType);
  }

  onClickNotice(e: Event, notice: Notice) {
    e.preventDefault();
    this.noticesService.updateRead(notice.id);
  }

  onClickDeleteNotice(target: Notice) {
    this.noticesService.delete(target.id);
    this.noticeList$.pipe(
      map(nl => nl.filter(n => n.id !== target.id))
    ).subscribe(nl => this.noticeList$ = of(nl));
  }

}
