import { forkJoin, of } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '@app/core/http/firestore.service';
import { FcmToken, NewFcmToken } from '@app/core/model';

@Injectable({
  providedIn: 'root'
})
export class FcmTokensService extends FirestoreService<FcmToken> {

  constructor(afs: AngularFirestore) {
    super(afs, 'fcmTokens');
  }

  changeToken(token: NewFcmToken) {
    return this.query({
      where: [['profileId', '==', token.profileId]]
    }).pipe(
      first(),
      switchMap(col => col.length > 0 ? forkJoin(...col.map(doc => this.delete(doc.id))) : of(null)),
      switchMap(() => this.add(token))
    );
  }

}
