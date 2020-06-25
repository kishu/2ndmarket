import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '@app/core/http/firestore.service';
import { Profile } from "@app/core/model";

@Injectable({
  providedIn: 'root'
})
export class ProfilesService extends FirestoreService<Profile> {

  constructor(protected afs: AngularFirestore) {
    super(afs, 'profiles');
  }

  getBy(email: string, groupId: string): Observable<Profile[]> {
    return this.query({
      where: [
        ['groupId', '==', groupId],
        ['email', '==', email]
      ]
    });
  }

}
