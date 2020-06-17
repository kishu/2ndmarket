import { Component, OnInit } from '@angular/core';
import { Goods, NewGoods } from '@app/core/model';
import { AuthService, GoodsService } from '@app/core/http';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-goods-write2',
  templateUrl: './goods-write2.component.html',
  styleUrls: ['./goods-write2.component.scss']
})
export class GoodsWrite2Component implements OnInit {

  constructor(
    private authService: AuthService,
    private goodsService: GoodsService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(goods: Partial<Goods>) {
    this.authService.user$
      .pipe(
        map(u => ({
          ...goods,
          userId: u.id,
          favoritesCnt: 0,
          commentCnt: 0,
          created: GoodsService.serverTimestamp(),
          updated: GoodsService.serverTimestamp(),
        } as NewGoods)),
        switchMap(g => this.goodsService.add(g))
      )
      .subscribe(
        () => alert('ok'),
        (err) => alert(err)
      );
  }

}
