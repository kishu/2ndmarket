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
  @Input() stateChangeActions: DocumentChangeAction<any>[];
  deleted = false;

  constructor(
    private goodsCacheService: GoodsCacheService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.stateChangeActions.currentValue) {
      const actions = changes.stateChangeActions.currentValue as DocumentChangeAction<any>[];
      actions.filter(action => action.payload.doc.id === this.goods.id).forEach(action => {
        console.log('change', action.type, action.payload);
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
