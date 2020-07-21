import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DocumentChangeAction } from '@angular/fire/firestore';
import { GoodsCacheService } from '@app/core/persistence';
import { Goods } from '@app/core/model';

@Component({
  selector: 'app-goods-list-item',
  templateUrl: './goods-list-item.component.html',
  styleUrls: ['./goods-list-item.component.scss']
})
export class GoodsListItemComponent implements OnInit, OnChanges {
  @Input() goods: Goods;
  @Input() goodsStateChanges: DocumentChangeAction<any>[];
  deleted = false;

  constructor(
    private goodsCacheService: GoodsCacheService
  ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.goods && changes.goodsStateChanges?.currentValue) {
      const actions = changes.goodsStateChanges.currentValue as DocumentChangeAction<any>[];
      actions
        .filter(action => action.payload.doc.id === this.goods.id)
        .forEach(action => {
          switch (action.type) {
            case 'modified':
              this.goods = { id: action.payload.doc.id, ... action.payload.doc.data() };
              break;
            case 'removed':
              this.goods = null;
              this.deleted = true;
              break;
          }
        });
    }
  }

  onClickGoods(e: Event, goods: Goods) {
    e.preventDefault();
    this.goodsCacheService.cache(goods);
  }

}
