import * as faker from 'faker';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Goods, ImageFileOrUrl } from '@app/core/model';
import { ImagesControlComponent } from '@app/shared/components/images-control/images-control.component';

@Component({
  selector: 'app-goods-form',
  templateUrl: './goods-form.component.html',
  styleUrls: ['./goods-form.component.scss']
})
export class GoodsFormComponent implements OnInit {
  @Input() submitting = false;
  @Output() formSubmit = new EventEmitter<{ goods: Partial<Goods>, imageFileOrUrls: ImageFileOrUrl[] } >();
  @ViewChild(ImagesControlComponent) imagesCtl: ImagesControlComponent;
  goodsForm = this.fb.group({
    name: [faker.commerce.productName()],
    public: [false],
    purchased: ['week'],
    condition: ['boxed'],
    price: [faker.commerce.price()],
    shipping: ['directly'],
    contact: [faker.phone.phoneNumber()],
    memo: [faker.lorem.paragraphs()],
    soldOut: [false],
  });

  get nameCtl() { return this.goodsForm.get('name'); }
  get publicCtl() { return this.goodsForm.get('public'); }
  get purchasedCtl() { return this.goodsForm.get('purchased'); }
  get conditionCtl() { return this.goodsForm.get('condition'); }
  get priceCtl() { return this.goodsForm.get('price'); }
  get shippingCtl() { return this.goodsForm.get('shipping'); }
  get contactCtl() { return this.goodsForm.get('contact'); }
  get memoCtl() { return this.goodsForm.get('memo'); }
  get soldOutCtl() { return this.goodsForm.get('soldOut'); }

  get imageFileOrUrls() { return this.imagesCtl?.imageFileOrUrls; }
  get imagesCount() { return this.imagesCtl?.imagesCount; }
  get imageFilesSize() { return this.imagesCtl?.imageFilesSize; }

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.submitting = true;
    const goods = this.goodsForm.value as Partial<Goods>;
    this.formSubmit.emit({goods, imageFileOrUrls: this.imageFileOrUrls});
  }

}
