import { Injectable } from '@angular/core';
import { FirestoreService } from '@app/core/http/firestore.service';
import { Comment, GoodsRef } from '@app/core/model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GoodsCommentsService extends FirestoreService<Comment> {
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
