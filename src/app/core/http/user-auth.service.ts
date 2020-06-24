import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from "@app/core/http/firestore.service";
import { UserAuth } from '@app/core/model';


@Injectable({
  providedIn: 'root'
})
export class UserAuthService extends FirestoreService<UserAuth>{

  constructor(protected afs: AngularFirestore) {
    super(afs, 'userAuths');
  }
}
