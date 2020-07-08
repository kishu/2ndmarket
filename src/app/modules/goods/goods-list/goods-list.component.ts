import { random } from 'lodash-es';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, GoodsService, } from '@app/core/http';

@Component({
  selector: 'app-goods-list',
  templateUrl: './goods-list.component.html',
  styleUrls: ['./goods-list.component.scss']
})
export class GoodsListComponent implements OnInit {
  groupId$ = this.activatedRoute.paramMap.pipe(
    map(m => m.get('groupId')),
    shareReplay(1)
  );

  goodsList$ = this.groupId$.pipe(
    switchMap(groupId => this.goodsService.getQueryByGroupId(groupId)),
    map(goodsList => goodsList.map(goods => {
      return {
        ...goods,
        images: goods.images.length > 2 ?
          [ goods.images[0], goods.images[random(1, goods.images.length - 1)] ] :
          goods.images
      };
    }))
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

}
