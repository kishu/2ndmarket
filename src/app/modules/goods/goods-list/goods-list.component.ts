import { Component, OnInit } from '@angular/core';
import { GoodsService } from '@app/core/http/goods.service';

@Component({
  selector: 'app-goods-list',
  templateUrl: './goods-list.component.html',
  styleUrls: ['./goods-list.component.scss']
})
export class GoodsListComponent implements OnInit {

  goodsList$: any;

  constructor(private goodsService: GoodsService) {
    this.goodsList$ = this.goodsService.getAll([['updated', 'desc']]);
  }

  ngOnInit(): void {
  }

}
