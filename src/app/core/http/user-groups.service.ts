import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { FirestoreService } from '@app/core/http/firestore.service';
import { Group, UserGroup } from '@app/core/model';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { GroupsService } from "@app/core/http/groups.service";

@Injectable({
  providedIn: 'root'
})
export class UserGroupsService extends FirestoreService<UserGroup> {

  constructor(
    protected afs: AngularFirestore,
    private groupService: GroupsService
  ) {
    super(afs, 'userGroups');
  }

  getAllByUserId(id: string): Observable<UserGroup[]> {
    return this.query({
      where: [['userId', '==', id]],
      orderBy: [['created', 'desc']]
    });
  }

  getByUserIdAndGroupRef(userId: string, groupIdOrRef: string | DocumentReference): Observable<UserGroup[]> {
    const groupRef = (typeof groupIdOrRef === 'string') ? this.groupService.getDocRef(groupIdOrRef) : groupIdOrRef;
    return this.query({
      where: [
        ['userId', '==', userId],
        ['groupRef', '==', groupRef]
      ]
    });
  }
}
