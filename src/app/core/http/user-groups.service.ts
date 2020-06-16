import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Injectable } from '@angular/core';
import { FirestoreService } from "@app/core/http/firestore.service";
import { UserGroup } from "@app/core/model";
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class UserGroupsService extends FirestoreService<UserGroup> {

  constructor(protected afs: AngularFirestore) {
    super(afs, 'userGroups');
  }

  getByUserId(id): Observable<UserGroup | null> {
    return this.query({ where: [['userId', '==', id]]})
      .pipe(
        map(ug => ug.length === 0 ? null : ug[0])
      );
  }
}
