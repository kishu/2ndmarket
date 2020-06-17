import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GoodsService } from '@app/core/http';

@Component({
  selector: 'app-goods-write',
  templateUrl: './goods-write.component.html',
  styleUrls: ['./goods-write.component.scss']
})
export class GoodsWriteComponent implements OnInit {
  goodsWriteForm: FormGroup;

  get name() { return this.goodsWriteForm.get('name'); }
  get category() { return this.goodsWriteForm.get('category'); }
  get purchaseTime() { return this.goodsWriteForm.get('purchaseTime'); }
  get condition() { return this.goodsWriteForm.get('condition'); }
  get price() { return this.goodsWriteForm.get('price'); }
  get delivery() { return this.goodsWriteForm.get('delivery'); }
  get contact() { return this.goodsWriteForm.get('contact'); }
  get memo() { return this.goodsWriteForm.get('memo'); }

  constructor(
    private goodsService: GoodsService,
    private fb: FormBuilder
  ) {
    this.goodsWriteForm = this.fb.group({
      name: [''],
      property: [''],
      purchaseTime: [''],
      condition: [''],
      price: [''],
      delivery: [''],
      contact: [''],
      memo: [''],
    });
  }

  ngOnInit(): void {
  }

  submit() {
    // const newGoods: NewGoods = {
    //   title: 'new goods222',
    //   public: true,
    //   category: GoodsCategory.beauty,
    //   purchaseTime: GoodsPurchaseTime.month,
    //   condition: GoodsCondition.boxed,
    //   price: 25000,
    //   delivery: GoodsDelivery.courier,
    //   deliveryEtc: '',
    //   images: [
    //     'https://thefancy-media-ec.thefancy.com/1280/20170131/1346364284443034953_63cd458bb756.jpg'
    //   ],
    //   contact: '01029400359',
    //   favoritesCnt: 0,
    //   commentCnt: 0,
    //   created: GoodsService.serverTimestamp(),
    //   updated: GoodsService.serverTimestamp()
    // };

    // this.goodsService.add(newGoods).then(() => console.log('ok'));
  }

}
