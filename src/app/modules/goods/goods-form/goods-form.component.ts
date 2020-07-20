import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { Goods, NewGoods, DraftImage } from '@app/core/model';
import { ImagesControlComponent } from '@app/shared/components/images-control/images-control.component';

@Component({
  selector: 'app-goods-form',
  templateUrl: './goods-form.component.html',
  styleUrls: ['./goods-form.component.scss']
})
export class GoodsFormComponent implements OnInit {
  maxImages = 10;
  @Input() goods: NewGoods | Goods;
  @Input() submitting = false;
  @Output() formSubmit = new EventEmitter<{ goods: NewGoods | Partial<Goods>, draftImages: DraftImage[] }>();
  @ViewChild(ImagesControlComponent) imagesCtl: ImagesControlComponent;

  goodsForm = this.fb.group({
    name: [],
    shared: [],
    purchased: [],
    condition: [],
    price: [],
    shipping: [],
    contact: [],
    memo: [],
    soldOut: [],
  });

  get nameCtl() { return this.goodsForm.get('name'); }
  // get sharedCtl() { return this.goodsForm.get('shared'); }
  get purchasedCtl() { return this.goodsForm.get('purchased'); }
  get conditionCtl() { return this.goodsForm.get('condition'); }
  get priceCtl() { return this.goodsForm.get('price'); }
  get shippingCtl() { return this.goodsForm.get('shipping'); }
  get contactCtl() { return this.goodsForm.get('contact'); }
  get memoCtl() { return this.goodsForm.get('memo'); }
  // get soldOutCtl() { return this.goodsForm.get('soldOut'); }

  constructor(
    private fb: FormBuilder,
    private decimalPipe: DecimalPipe,
    private location: Location
  ) {
  }

  ngOnInit(): void {
    const { name, shared, purchased, condition, price, shipping, contact, memo, soldOut } = this.goods;
    this.goodsForm.setValue({
      name, shared, purchased, condition, shipping, contact, memo, soldOut,
      price: this.decimalPipe.transform(this.goods.price, '1.0-0')
    });

    this.priceCtl.valueChanges.subscribe(value => {
      if (value) {
        const parseIntPrice = parseInt(value.replace(/,/g, ''), 10);
        const decimalPrice = parseIntPrice ? this.decimalPipe.transform(parseIntPrice, '1.0-0') : '';
        this.priceCtl.setValue(decimalPrice, { emitEvent: false });
      }
    });
  }

  onSubmit() {
    this.submitting = true;
    if (this.imagesCtl.draftImages.length === 0) {
      alert(`이미지를 선택해 주세요(최대 ${this.maxImages}장)`);
      this.submitting = false;
      return;
    }
    this.goods = { ...this.goods, ...this.goodsForm.value };
    this.formSubmit.emit({ goods: this.goods, draftImages: this.imagesCtl?.draftImages });
  }

  onClickHistoryBack() {
    this.location.back();
  }
}
