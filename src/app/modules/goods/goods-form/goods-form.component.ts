import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Goods, ImageFileOrUrl, NewGoods } from '@app/core/model';
import { ImagesControlComponent } from '@app/shared/components/images-control/images-control.component';

@Component({
  selector: 'app-goods-form',
  templateUrl: './goods-form.component.html',
  styleUrls: ['./goods-form.component.scss']
})
export class GoodsFormComponent implements OnInit, AfterViewInit {
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

  @Input() goods: NewGoods | Goods;
  @Input() submitting = false;
  @Output() formSubmit = new EventEmitter<{ goods: NewGoods | Goods, imageFileOrUrls: ImageFileOrUrl[] }>();
  @ViewChild(ImagesControlComponent) imagesCtl: ImagesControlComponent;

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
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    const { name, shared, purchased, condition, price, shipping, contact, memo, soldOut } = this.goods;
    this.goodsForm.setValue({ name, shared, purchased, condition, price, shipping, contact, memo, soldOut });
  }

  ngAfterViewInit(): void {

  }

  onSubmit() {
    this.submitting = true;
    this.goods = { ...this.goods, ...this.goodsForm.value };
    this.formSubmit.emit({ goods: this.goods, imageFileOrUrls: this.imagesCtl?.imageFileOrUrls });
  }

}
