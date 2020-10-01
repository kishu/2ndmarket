import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { head } from 'lodash-es';
import { Injectable } from '@angular/core';
import { firestore } from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '@app/core/http/firestore.service';
import { Profiles2Service } from '@app/core/http/profiles.service';
import { Account } from '@app/core/model';

@Injectable({
  providedIn: 'root'
})
export class AccountsService extends FirestoreService<Account>{

  constructor(
    protected afs: AngularFirestore,
    private profile2Service: Profiles2Service
  ) {
    super(afs, 'accounts');
  }

  getQueryByUserId(userId: string) {
    return super.getQuery({
      where: [
        ['userId', '==', userId]
      ]
    }).pipe(
      switchMap(accounts => {
        return forkJoin(
          accounts.map(account => this.profile2Service.getWithGroup(account.profileId))
        ).pipe(
          map(profiles => accounts.map((account, i) => ({ ...account, profile: profiles[i] })))
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
      switchMap(accounts => {
        return forkJoin(
          accounts.map(account => this.profile2Service.getWithGroup(account.profileId))
        ).pipe(
          map(profiles => accounts.map((account, i) => ({ ...account, profile: profiles[i] }))),
          map(profiles => head(profiles))
        );
      })
    );
  }

  activate(id: string) {
    return this.update(id, { activated: firestore.FieldValue.serverTimestamp() });
  }

}
