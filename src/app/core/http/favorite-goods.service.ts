import { forkJoin, Observable } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '@app/core/http/firestore.service';
import { FavoriteGoods, NewFavoriteGoods } from '@app/core/model';

@Injectable({
  providedIn: 'root'
})
export class FavoriteGoodsService extends FirestoreService<FavoriteGoods> {

  constructor(protected afs: AngularFirestore) {
    super(afs, 'favoriteGoods');
  }

  add(newGoodsFavorite: NewFavoriteGoods) {
    return super.add(newGoodsFavorite);
  }

  getQueryByGoodsIdAndProfileId(goodsId: string, profileId: string): Observable<FavoriteGoods[]> {
    return super.getQuery({
      where: [
        ['goodsId', '==', goodsId],
        ['profileId', '==', profileId]
      ]
    });
  }

  getQueryByGoodsId(goodsId: string): Observable<FavoriteGoods[]> {
    return super.getQuery({
      where: [['goodsId', '==', goodsId]]
    });
  }

  /*
   * consider deprecated
   */
  getQueryByProfileId(profileId: string): Observable<FavoriteGoods[]> {
    return super.getQuery({
      where: [['profileId', '==', profileId]]
    });
  }

  valueChangesByProfileId(profileId: string): Observable<FavoriteGoods[]> {
    return super.valueChangesQuery({
      where: [['profileId', '==', profileId]]
    });
  }

  deleteByGoodsIdAndProfileId(goodsId: string, profileId: string) {
    return super.getQuery({
      where: [
        ['goodsId', '==', goodsId],
        ['profileId', '==', profileId]
      ]
    }).pipe(
      map(f => f.map(i => this.delete(i.id))),
      switchMap(d => forkJoin(d))
    );
  }

}
