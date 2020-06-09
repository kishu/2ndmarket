import { Component, OnInit } from '@angular/core';
import { GoodsService } from '@app/core/http';
import { GoodsCategory, GoodsCondition, GoodsDelivery, GoodsPurchaseTime, NewGoods } from '@app/core/model';

@Component({
  selector: 'app-goods-write',
  templateUrl: './goods-write.component.html',
  styleUrls: ['./goods-write.component.scss']
})
export class GoodsWriteComponent implements OnInit {

  constructor(private goodsService: GoodsService) { }

  ngOnInit(): void {
  }

  onClickAdd() {
    const newGoods: NewGoods = {
      title: 'new goods222',
      public: true,
      category: GoodsCategory.beauty,
      purchaseTime: GoodsPurchaseTime.month,
      condition: GoodsCondition.boxed,
      price: 25000,
      delivery: GoodsDelivery.courier,
      deliveryEtc: '',
      images: [
        'https://thefancy-media-ec.thefancy.com/1280/20170131/1346364284443034953_63cd458bb756.jpg'
      ],
      contact: '01029400359',
      favoritesCnt: 0,
      commentCnt: 0,
      created: GoodsService.serverTimestamp(),
      updated: GoodsService.serverTimestamp()
    };

    this.goodsService.add(newGoods).then(() => console.log('ok'));
  }

}
