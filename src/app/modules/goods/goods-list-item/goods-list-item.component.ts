import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DocumentChangeAction } from '@angular/fire/firestore';
import { GoodsCacheService } from '@app/core/persistence';
import { GoodsListItemUpdateService } from "../services/goods-list-item-update.service";
import { Goods } from '@app/core/model';
import { filter } from "rxjs/operators";

@Component({
  selector: 'app-goods-list-item',
  templateUrl: './goods-list-item.component.html',
  styleUrls: ['./goods-list-item.component.scss']
})
export class GoodsListItemComponent implements OnInit, OnChanges {
  @Input() goods: Goods;
  @Input() updatedGoods: Goods;

  constructor(
    private goodsCacheService: GoodsCacheService,
    // private goodsListItemUpdateService: GoodsListItemUpdateService
  ) {
    // console.log('GoodsListItem con', this);
    // goodsListItemUpdateService.updatedGoods$.pipe(
    //   filter(g => !!g && g.id === this.goods.id)
    // ).subscribe(updatedGoods => {
    //   console.log('up', updatedGoods);
    //   this.goods = updatedGoods;
    // })
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.updatedGoods?.currentValue) {
      if (changes.updatedGoods.currentValue.id == this.goods.id) {
        console.log('updated', changes.updatedGoods.currentValue);
        this.goods = changes.updatedGoods.currentValue;
      }
    }
    // if (this.goods && changes.goodsStateChanges?.currentValue) {
    //   const actions = changes.goodsStateChanges.currentValue as DocumentChangeAction<any>[];
    //   actions
    //     .filter(action => action.payload.doc.id === this.goods.id)
    //     .forEach(action => {
    //       switch (action.type) {
    //         case 'modified':
    //           this.goods = { id: action.payload.doc.id, ... action.payload.doc.data() };
    //           break;
    //         case 'removed':
    //           this.goods = null;
    //           break;
    //       }
    //     });
    // }
  }

  onClickGoods(e: Event, goods: Goods) {
    e.preventDefault();
    this.goodsCacheService.cache(goods);
  }

}
