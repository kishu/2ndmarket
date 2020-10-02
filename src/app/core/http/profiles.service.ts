import { firestore } from 'firebase/app';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '@app/core/http/firestore.service';
import { NewProfile, Profile, Profile2, NewProfile2 } from '@app/core/model';
import { GroupsService } from '@app/core/http/groups.service';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Profiles2Service extends FirestoreService<Profile2> {

  constructor(
    protected afs: AngularFirestore,
    protected groupService: GroupsService
  ) {
    super(afs, 'profiles2');
  }

}

@Injectable({
  providedIn: 'root'
})
export class ProfilesService extends FirestoreService<Profile> {

  constructor(protected afs: AngularFirestore) {
    super(afs, 'profiles');
  }

  add(newProfile: NewProfile) {
    return super.add(newProfile);
  }

  getQueryByUserId(userId: string) {
    return super.getQuery({
      where: [
        ['userIds', 'array-contains', userId]
      ]
    });
  }

  getQueryByEmail(email: string) {
    return super.getQuery({
      where: [
        ['email', '==', email]
      ]
    });
  }

  valueChangesQueryByUserId(userId: string) {
    return super.valueChangesQuery({
      where: [
        ['userIds', 'array-contains', userId]
      ]
    });
  }

  getQueryByEmailAndGroupId(email: string, groupId: string): Observable<Profile[]> {
    return super.getQuery({
      where: [
        ['groupId', '==', groupId],
        ['email', '==', email]
      ]
    });
  }

  updateUserIdAdd(profileId: string, userId: string) {
    return super.update(profileId, {
      userIds: firestore.FieldValue.arrayUnion(userId)
    });
  }

  updateUserIdRemove(profileId: string, userId: string) {
    return super.update(profileId, {
      userIds: firestore.FieldValue.arrayRemove(userId)
    });
  }

  update(profileId: string, profile: Partial<Profile>) {
    return super.update(profileId, profile);
  }

}
