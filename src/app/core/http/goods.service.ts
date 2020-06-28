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
      where: [
        ['groupId', '==', groupId],
        ['activated', '==', true]
      ],
      orderBy: [['updated', 'desc']]
    });
  }

  getAllByProfileId(profileId: string, limit: number = 100): Observable<Goods[]> {
    return this.query({
      where: [['profileId', '==', profileId]],
      orderBy: [['created', 'desc']],
      limit
    });
  }

  updateSoldOut(goodsId: string, soldOut: boolean) {
    return this.update(goodsId, { soldOut: soldOut ? GoodsService.serverTimestamp() : false } as any);
  }

}
