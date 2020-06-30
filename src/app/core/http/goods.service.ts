import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '@app/core/http/firestore.service';
import { Goods, NewGoods, UpdateGoods } from '@app/core/model';

@Injectable({
  providedIn: 'root'
})
export class GoodsService extends FirestoreService<Goods> {
  constructor(protected afs: AngularFirestore) {
    super(afs, 'goods');
  }

  add(newGoods: NewGoods) {
    return super.add(newGoods);
  }

  update(goodsId: string, goods: Partial<Goods>) {
    const updateGoods: UpdateGoods = {
      ...goods,
      updated: FirestoreService.serverTimestamp()
    };
    delete updateGoods.id;
    return super.update(goodsId, updateGoods);
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

  updateImages(goodsId: string, images: string/* url */[]) {
    return super.update(goodsId, { images });
  }

  updateProcessed(goodsId: string) {
    return super.update(goodsId, { processing: false });
  }

  updateSoldOut(goodsId: string, soldOut: boolean) {
    return super.update(goodsId, { soldOut: soldOut ? GoodsService.serverTimestamp() : false });
  }

}
