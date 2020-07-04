import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, GoodsService, } from '@app/core/http';
import { Goods } from '@app/core/model';

@Component({
  selector: 'app-goods-list',
  templateUrl: './goods-list.component.html',
  styleUrls: ['./goods-list.component.scss']
})
export class GoodsListComponent implements OnInit, OnDestroy {
  groupId$ = this.activatedRoute.paramMap.pipe(
    map(m => m.get('groupId')),
    shareReplay(1)
  );

  goodsList$ = this.groupId$.pipe(
    switchMap(groupId => this.goodsService.getQueryByGroupId(groupId))
  );

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private goodsService: GoodsService
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }

}
