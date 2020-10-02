import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { head } from 'lodash-es';
import { firestore } from 'firebase/app';
import { Injectable } from '@angular/core';
import { Membership } from '@app/core/model/membership';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '@app/core/http/firestore.service';
import { GroupsService } from '@app/core/http/groups.service';
import { Profiles2Service } from '@app/core/http/profiles.service';

@Injectable({
  providedIn: 'root'
})
export class MembershipsService extends FirestoreService<Membership> {

  constructor(
    protected afs: AngularFirestore,
    protected groupsService: GroupsService,
    protected profiles2Service: Profiles2Service
  ) {
    super(afs, 'memberships');
  }

  getQueryByUserId(userId: string) {
    return super.getQuery({
      where: [
        ['userId', '==', userId]
      ]
    }).pipe(
      switchMap(memberships => {
        return forkJoin([
          forkJoin(memberships.map(membership => this.groupsService.get(membership.groupId))),
          forkJoin(memberships.map(membership => this.profiles2Service.get(membership.profileId)))
        ]).pipe(
          map(([groups, profiles]) => {
            return memberships.map((membership, i) => {
              return { ...membership, group: groups[i], profile: profiles[i] };
            });
          })
        );
      })
    );
  }

  getActivatedByUserId(userId: string) {
    return super.getQuery({
      where: [
        ['userId', '==', userId]
      ],
      orderBy: [
        ['activated', 'desc']
      ],
      limit: 1
    }).pipe(
      switchMap(memberships => {
        return forkJoin([
          forkJoin(memberships.map(membership => this.groupsService.get(membership.groupId))),
          forkJoin(memberships.map(membership => this.profiles2Service.get(membership.profileId)))
        ]).pipe(
          map(([groups, profiles]) => {
            return memberships.map((membership, i) => {
              return { ...membership, group: groups[i], profile: profiles[i] };
            });
          }),
          map(m => head(m))
        );
      })
    );
  }

  activate(id: string) {
    return this.update(id, { activated: firestore.FieldValue.serverTimestamp() });
  }
}
