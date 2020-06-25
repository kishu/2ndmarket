import { forkJoin, Observable } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '@app/core/http/firestore.service';
import { GoodsFavorite } from '@app/core/model';

@Injectable({
  providedIn: 'root'
})
export class GoodsFavoritesService extends FirestoreService<GoodsFavorite> {

  constructor(protected afs: AngularFirestore) {
    super(afs, 'goodsFavorites');
  }

  getAllByGoodsId(goodsId: string): Observable<GoodsFavorite[]> {
    return this.query({
      where: [['goodsId', '==', goodsId]]
    });
  }

  getAllByUserId(userId: string): Observable<GoodsFavorite[]> {
    return this.query({
      where: [['userId', '==', userId]]
    });
  }

  deleteByGoodsIdAndProfileId(goodsId: string, profileId: string, ) {
    return this.query({
      where: [
        ['goodsId', '==', goodsId],
        ['profileId', '==', profileId]
      ]
    }).pipe(
      first(),
      map(f => f.map(i => this.delete(i.id))),
      switchMap(d => forkJoin(...d))
    );
  }

}
