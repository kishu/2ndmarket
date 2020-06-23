import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '@app/core/http/firestore.service';
import { GoodsFavorite, GoodsRef } from '@app/core/model';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class GoodsFavoriteService extends FirestoreService<GoodsFavorite> {

  constructor(protected afs: AngularFirestore) {
    super(afs, 'goodsFavorites');
  }



  getCountByGoodsRef(goodsRef: GoodsRef): Observable<number> {
    return this.query({
      where: [
        ['goodsRef', '==', goodsRef]
      ]
    }).pipe(
      map(f => f.length)
    );
  }

  isFavorite(goodsRef: GoodsRef, userId: string): Observable<boolean> {
    return this.query({
      where: [
        ['goodsRef', '==', goodsRef],
        ['userId', '==', userId]
      ]
    }).pipe(
      map(f => f.length > 0)
    );
  }
}
