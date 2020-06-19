import { Observable, of } from 'rxjs';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, GoodsService, GoodsCacheService } from '@app/core/http';
import { Goods, User } from '@app/core/model';

@Component({
  selector: 'app-goods-detail',
  templateUrl: './goods-detail.component.html',
  styleUrls: ['./goods-detail.component.scss']
})
export class GoodsDetailComponent implements OnInit {
  user$ = this.authService.user$.pipe(first());
  goods$: Observable<Goods>;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
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
