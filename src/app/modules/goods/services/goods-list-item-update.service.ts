import { ReplaySubject, Subject } from "rxjs";
import { Injectable } from '@angular/core';
import { Goods } from "@app/core/model/goods";

@Injectable({
  providedIn: 'any'
})
export class GoodsListItemUpdateService {
  updatedGoods$ = new ReplaySubject<Goods>();
  constructor() { }
}
