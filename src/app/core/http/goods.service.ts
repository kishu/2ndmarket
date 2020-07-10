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

  create(goodsId: string, newGoods: NewGoods) {
    return super.create(goodsId, newGoods);
  }

  update(goodsId: string, goods: Partial<Goods>) {
    const updateGoods: UpdateGoods = {
      ...goods,
      updated: FirestoreService.serverTimestamp()
    };
    delete updateGoods.id;
    return super.update(goodsId, updateGoods);
  }

  getQueryByGroupId(groupId: string): Observable<Goods[]> {
    return super.getQuery({
      where: [
        ['groupId', '==', groupId]
      ],
      orderBy: [['updated', 'desc']]
    });
  }

  valueChangesByGroupId(groupId: string): Observable<Goods[]> {
    return super.valueChangesQuery({
      where: [
        ['groupId', '==', groupId],
        ['activated', '==', true]
      ],
      orderBy: [['updated', 'desc']]
    });
  }

  getQueryByProfileId(profileId: string, limit: number = 100): Observable<Goods[]> {
    return super.getQuery({
      where: [['profileId', '==', profileId]],
      orderBy: [['created', 'desc']],
      limit
    });
  }

  updateSoldOut(goodsId: string, soldOut: boolean) {
    return super.update(goodsId, { soldOut: soldOut ? GoodsService.serverTimestamp() : false });
  }

  moveToTrash(goods: Goods) {
    const goodsId = goods.id;
    delete goods.id;
    return Promise.all([
      this.afs.collection('deletedGoods').doc(goodsId).set(goods),
      super.delete(goodsId)
    ]);
  }

}
