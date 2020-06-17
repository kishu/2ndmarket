import range from 'lodash/range';
import random from 'lodash/random';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Goods } from '@app/core/model';

@Component({
  selector: 'app-goods-form',
  templateUrl: './goods-form.component.html',
  styleUrls: ['./goods-form.component.scss']
})
export class GoodsFormComponent implements OnInit {
  // tslint:disable-next-line:no-output-native
  @Output() formSubmit = new EventEmitter<Partial<Goods>>();
  submitting = false;
  goodsForm = this.fb.group({
    name: [''],
    public: [true],
    purchased: [''],
    condition: [''],
    price: [0],
    shipping: [''],
    contact: [''],
    memo: [''],
  });

  get nameCtl() { return this.goodsForm.get('name'); }
  get publicCtl() { return this.goodsForm.get('public'); }
  get purchasedCtl() { return this.goodsForm.get('purchased'); }
  get conditionCtl() { return this.goodsForm.get('condition'); }
  get priceCtl() { return this.goodsForm.get('price'); }
  get shippingCtl() { return this.goodsForm.get('shipping'); }
  get contactCtl() { return this.goodsForm.get('contact'); }
  get memoCtl() { return this.goodsForm.get('memo'); }

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.submitting = true;
    const images = range(random(1, 7)).map(() => 'https://source.unsplash.com/random');
    this.formSubmit.emit({ ...this.goodsForm.value, images });
  }

}
