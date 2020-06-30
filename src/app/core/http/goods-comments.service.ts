import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '@app/core/http/firestore.service';
import { GoodsComment, NewGoodsComment } from '@app/core/model';

@Injectable({
  providedIn: 'root'
})
export class GoodsCommentsService extends FirestoreService<GoodsComment> {
  constructor(
    protected afs: AngularFirestore
  ) {
    super(afs, 'goodsComments');
  }

  add(newGoodsComment: NewGoodsComment) {
    return super.add(newGoodsComment);
  }

  getAllByGoodsId(goodsId: string) {
    return this.query({
      where: [['goodsId', '==', goodsId]],
      orderBy: [['created', 'asc']]
    });
  }
}
