import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '@app/core/http/firestore.service';
import { GoodsComment, GoodsRef } from '@app/core/model';

@Injectable({
  providedIn: 'root'
})
export class GoodsCommentsService extends FirestoreService<GoodsComment> {
  constructor(protected afs: AngularFirestore) {
    super(afs, 'goodsComments');
  }

  getAllByGoodsRef(ref: GoodsRef) {
    return this.query({
      where: [['goodsRef', '==', ref]],
      orderBy: [['created', 'asc']]
    });
  }
}
