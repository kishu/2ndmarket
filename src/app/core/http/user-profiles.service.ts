import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '@app/core/http/firestore.service';
import { UserProfile } from "@app/core/model";

@Injectable({
  providedIn: 'root'
})
export class UserProfilesService extends FirestoreService<UserProfile> {

  constructor(protected afs: AngularFirestore) {
    super(afs, 'userProfiles');
  }

  getAllByUserId(userId: string) {
    return this.query({
      where: [['userId', '==', userId]]
    });
  }

  getByUserIdAndProfileId(userId: string, profileId: string) {
    return this.query({
      where: [
        ['userId', '==', userId],
        ['profileId', '==', profileId]
      ]
    });
  }

}
