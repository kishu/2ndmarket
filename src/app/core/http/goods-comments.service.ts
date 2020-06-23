import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '@app/core/http/firestore.service';
import { GoodsComment, GoodsRef } from '@app/core/model';
import { GoodsService } from '@app/core/http/goods.service';

@Injectable({
  providedIn: 'root'
})
export class GoodsCommentsService extends FirestoreService<GoodsComment> {
  constructor(
    protected afs: AngularFirestore,
    private goodsService: GoodsService,
  ) {
    super(afs, 'goodsComments');
  }

  getAllByGoodsRef(goodsRefOrId: GoodsRef | string) {
    const goodsRef = typeof goodsRefOrId === 'string' ? this.goodsService.getDocRef(goodsRefOrId) : goodsRefOrId;
    return this.query({
      where: [['goodsRef', '==', goodsRef]],
      orderBy: [['created', 'asc']]
    });
  }
}
