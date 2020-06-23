import { forkJoin, Observable } from 'rxjs';
import { combineAll, first, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '@app/core/http/firestore.service';
import { GoodsFavorite, GoodsRef } from '@app/core/model';
import { GoodsService } from '@app/core/http/goods.service';

@Injectable({
  providedIn: 'root'
})
export class GoodsFavoritesService extends FirestoreService<GoodsFavorite> {

  constructor(
    protected afs: AngularFirestore,
    private goodsService: GoodsService
  ) {
    super(afs, 'goodsFavorites');
  }

  getGoodsRef(goodsRefOrId: GoodsRef | string): GoodsRef {
    return  typeof goodsRefOrId === 'string' ?
      this.goodsService.getDocRef(goodsRefOrId) :
      goodsRefOrId as GoodsRef;
  }

  getAllBy(goodsRefOrId: GoodsRef | string) {
    const goodsRef = this.getGoodsRef(goodsRefOrId);
    return this.query({
      where: [['goodsRef', '==', goodsRef]]
    });
  }

  deleteBy(userId: string, goodsRefOrId: GoodsRef | string) {
    const goodsRef = this.getGoodsRef(goodsRefOrId);
    return this.query({
      where: [
        ['userId', '==', userId],
        ['goodsRef', '==', goodsRef]
      ]
    }).pipe(
      first(),
      map(f => f.map(i => this.delete(i.id))),
      switchMap(d => forkJoin(...d))
    );
  }

}
