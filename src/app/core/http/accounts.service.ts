import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '@app/core/http/firestore.service';
import { Profiles2Service } from '@app/core/http/profiles.service';
import { Account } from '@app/core/model';
import { map, switchMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

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
          accounts.map(account => this.profile2Service.get(account.profileId))
        ).pipe(
          map(profiles => accounts.map((account, i) => ({ ...account, profile: profiles[i] })))
        );
      })
    );
  }

}
