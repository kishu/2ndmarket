import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { FirestoreService } from '@app/core/http/firestore.service';
import { Group, UserGroup } from '@app/core/model';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserGroupsService extends FirestoreService<UserGroup> {

  constructor(protected afs: AngularFirestore) {
    super(afs, 'userGroups');
  }

  getAllByUserId(id: string): Observable<UserGroup[]> {
    return this.query({
      where: [['userId', '==', id]],
      orderBy: [['created', 'desc']]
    });
  }

  getByUserIdAndGroupId(uid: string, gRef: DocumentReference): Observable<UserGroup | null> {
    return this.query({
      where: [
        ['userId', '==', uid],
        ['groupRef', '==', gRef]
      ]
    })
      .pipe(
        map(ug => ug.length === 0 ? null : ug[0])
      );
  }
}
