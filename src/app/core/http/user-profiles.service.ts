import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '@app/core/http/firestore.service';
import { NewUserProfile, UserProfile } from '@app/core/model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserProfilesService extends FirestoreService<UserProfile> {

  constructor(protected afs: AngularFirestore) {
    super(afs, 'userProfiles');
  }

  add(newUserProfile: NewUserProfile) {
    return super.add(newUserProfile);
  }

  getAllByUserId(userId: string) {
    return this.query({
      where: [['userId', '==', userId]]
    });
  }

  getAllByUserIdAndProfileId(userId: string, profileId: string) {
    return this.query({
      where: [
        ['userId', '==', userId],
        ['profileId', '==', profileId]
      ]
    });
  }

}
