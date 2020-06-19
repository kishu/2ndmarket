import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoodsService, GoodsCacheService } from '@app/core/http';
import { Observable, of } from 'rxjs';
import { Goods } from '@app/core/model';

@Component({
  selector: 'app-goods-detail',
  templateUrl: './goods-detail.component.html',
  styleUrls: ['./goods-detail.component.scss']
})
export class GoodsDetailComponent implements OnInit {
  goods$: Observable<Goods>;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private goodsService: GoodsService,
    private goodsCacheService: GoodsCacheService
  ) {
    const goodsId = this.activatedRoute.snapshot.paramMap.get('goodsId');
    const cachedGoods = goodsCacheService.getGoods(goodsId);
    this.goods$ = cachedGoods ? of(cachedGoods) : this.goodsService.get(goodsId);
  }

  ngOnInit(): void {
  }

}
