import { Component, OnInit } from '@angular/core';
import { GoodsService } from '@app/core/http/goods.service';
import { GoodsCategory, GoodsCondition, GoodsDelivery, GoodsPurchaseTime, NewGoods } from '@app/core/model';
import { firestore } from 'firebase/app';

@Component({
  selector: 'app-goods-list',
  templateUrl: './goods-list.component.html',
  styleUrls: ['./goods-list.component.scss']
})
export class GoodsListComponent implements OnInit {

  constructor(protected goodsService: GoodsService) {

    const newGoods: NewGoods = {
      title: 'new goods',
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
      created: firestore.FieldValue,
      updated: firestore.FieldValue
    };

    this.goodsService.add(newGoods).then(() => console.log('ok'));
  }

  ngOnInit(): void {
  }

}
