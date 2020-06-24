import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from "@app/core/http/firestore.service";
import { User } from '@app/core/model';
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class UserService extends FirestoreService<User>{

  constructor(protected afs: AngularFirestore) {
    super(afs, 'users');
  }

  getUserByEmail(email: string): Observable<User[]> {
    return this.query({
      where: [['email', '==', email]]
    });
  }
}
