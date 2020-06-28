import { Observable, of } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, GoodsService, GoodsCacheService, GroupsService } from '@app/core/http';
import { Goods } from '@app/core/model';
import { filter, first, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-goods-list',
  templateUrl: './goods-list.component.html',
  styleUrls: ['./goods-list.component.scss']
})
export class GoodsListComponent implements OnInit {
  goodsList$ = this.authService.profile$.pipe(
    first(),
    filter(p => !!p),
    switchMap(p => this.goodsService.getAllByGroupId(p.groupId))
  );

  constructor(
    private router: Router,
    private authService: AuthService,
    private goodsService: GoodsService
  ) {
  }

  ngOnInit(): void {
  }

  onClickGoods(e: Event, goods: Goods) {
    e.preventDefault();
    this.router.navigate(['goods', goods.id]);
  }

}
