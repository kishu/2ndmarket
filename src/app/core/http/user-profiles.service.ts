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

  getQueryByUserId(userId: string) {
    return super.getQuery({
      where: [['userId', '==', userId]]
    });
  }

  getQueryByUserIdAndProfileId(userId: string, profileId: string) {
    return super.getQuery({
      where: [
        ['userId', '==', userId],
        ['profileId', '==', profileId]
      ]
    });
  }

}
