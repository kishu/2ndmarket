import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '@app/core/http/firestore.service';
import { NewProfile, Profile } from '@app/core/model';

@Injectable({
  providedIn: 'root'
})
export class ProfilesService extends FirestoreService<Profile> {

  constructor(protected afs: AngularFirestore) {
    super(afs, 'profiles');
  }

  add(newProfile: NewProfile) {
    console.log('add', newProfile);
    return super.add(newProfile);
  }

  getQueryByEmailAndGroupId(email: string, groupId: string): Observable<Profile[]> {
    return super.getQuery({
      where: [
        ['groupId', '==', groupId],
        ['email', '==', email]
      ]
    });
  }

}
