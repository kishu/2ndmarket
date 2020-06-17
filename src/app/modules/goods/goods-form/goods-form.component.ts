import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from "@angular/forms";

@Component({
  selector: 'app-goods-form',
  templateUrl: './goods-form.component.html',
  styleUrls: ['./goods-form.component.scss']
})
export class GoodsFormComponent implements OnInit {
  @Output() submit = new EventEmitter<null>();
  submitting = false;
  goodsForm = this.fb.group({
    name: [''],
    public: [''],
    purchased: [''],
    condition: [''],
    price: [],
    shipping: [''],
    contact: [''],
    memo: [''],
  });

  get nameCtl() { return this.goodsForm.get('name'); }
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
    this.submit.emit()
  }

}
