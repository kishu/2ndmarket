import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '@app/core/http/firestore.service';
import { Goods } from '@app/core/model';

@Injectable({
  providedIn: 'root'
})
export class GoodsService extends FirestoreService<Goods> {
  constructor(protected afs: AngularFirestore) {
    super(afs, 'goods');
  }

  getAllByGroupId(groupId: string): Observable<Goods[]> {
    return this.query({
      where: [['groupId', '==', groupId]],
      orderBy: [['updated', 'desc']]
    });
  }

  getAllByUserId(userId: string, limit: number = 100): Observable<Goods[]> {
    return this.query({
      where: [['userId', '==', userId]],
      orderBy: [['created', 'desc']],
      limit: limit
    });
  }

}
