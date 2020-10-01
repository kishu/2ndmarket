import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '@app/core/http/firestore.service';
import { Account } from '@app/core/model';

@Injectable({
  providedIn: 'root'
})
export class AccountsService extends FirestoreService<Account>{

  constructor(protected afs: AngularFirestore) {
    super(afs, 'accounts');
  }
}
