import { BehaviorSubject, of } from 'rxjs';
import { filter, first, map, shareReplay, switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AuthService, GoodsFavoritesService, GoodsService, NoticesService } from '@app/core/http';
import { Notice } from '@app/core/model';

@Component({
  selector: 'app-preference-write-goods, [app-preference-write-goods]',
  templateUrl: './preference-write-goods.component.html',
  styleUrls: ['./preference-write-goods.component.scss']
})
export class PreferenceWriteGoodsComponent implements OnInit {
  profile$ = this.authService.profile$.pipe(first(), filter(p => !!p), shareReplay());
  noticeList$ = this.profile$.pipe(
    switchMap(p => this.noticesService.valueChangesQueryByProfileId(p.id))
  );
  writeGoodsList$ = this.profile$.pipe(
    switchMap(p => this.goodsService.getQueryByProfileId(p.id))
  );

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
}
