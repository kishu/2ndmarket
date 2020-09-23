import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '@app/core/http/firestore.service';
import { UserInfo } from '@app/core/model';

@Injectable({
  providedIn: 'root'
})
export class UserInfosService extends FirestoreService<UserInfo> {

  constructor(protected afs: AngularFirestore) {
    super(afs, 'userInfos');
  }
}
