import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService, QueryOptions } from '@app/core/http/firestore.service';
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

  getQueryByGroupId(groupId: string, options: Partial<QueryOptions>): Observable<Goods[]> {
    options = {
      limit: 100,
      ...options,
      where: [
        ['groupId', '==', groupId]
      ],
      orderBy: [['updated', 'desc']],
    };
    return super.getQuery(options);
  }

  valueChangesQueryByGroupId(groupId: string, options: Partial<QueryOptions>): Observable<Goods[]> {
    options = {
      limit: 100,
      ...options,
      where: [
        ['groupId', '==', groupId]
      ],
      orderBy: [['updated', 'desc']],
    };
    return super.valueChangesQuery(options);
  }

  valueChangesQueryByProfileId(profileId: string, limit: number = 100): Observable<Goods[]> {
    return super.valueChangesQuery({
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
