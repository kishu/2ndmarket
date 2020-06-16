import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '@app/core/http/firestore.service';
import { Group } from '@app/core/model';

@Injectable({
  providedIn: 'root'
})
export class GroupsService extends FirestoreService<Group> {

  constructor(protected afs: AngularFirestore) {
    super(afs, 'groups');
  }

  getByDomain(domain: string): Observable<Group | null> {
    return this.query({
      where: [['domains', 'array-contains', domain]],
      limit: 1
    }).pipe(
      map(groups => groups[0] || null)
    );
  }

}
