import { forkJoin, Observable } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '@app/core/http/firestore.service';
import { GoodsFavorite, NewGoodsFavorite } from '@app/core/model';

@Injectable({
  providedIn: 'root'
})
export class GoodsFavoritesService extends FirestoreService<GoodsFavorite> {

  constructor(protected afs: AngularFirestore) {
    super(afs, 'goodsFavorites');
  }

  add(newGoodsFavorite: NewGoodsFavorite) {
    return super.add(newGoodsFavorite);
  }

  getQueryByGoodsIdAndProfileId(goodsId: string, profileId: string): Observable<GoodsFavorite[]> {
    return super.getQuery({
      where: [
        ['goodsId', '==', goodsId],
        ['profileId', '==', profileId]
      ]
    });
  }

  getQueryByGoodsId(goodsId: string): Observable<GoodsFavorite[]> {
    return super.getQuery({
      where: [['goodsId', '==', goodsId]]
    });
  }

  getQueryByProfileId(profileId: string): Observable<GoodsFavorite[]> {
    return super.getQuery({
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
