import { Component, OnInit } from '@angular/core';
import { PersistenceService } from '@app/core/persistence';

@Component({
  selector: 'app-preference-write-goods, [app-preference-write-goods]',
  templateUrl: './preference-write-goods.component.html',
  styleUrls: ['./preference-write-goods.component.scss']
})
export class PreferenceWriteGoodsComponent implements OnInit {
  goodsList$ = this.persistenceService.writeGoods$;

  constructor(
    private persistenceService: PersistenceService
  ) {
  }

  ngOnInit(): void {
  }
}
