import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '@app/core/http/firestore.service';
import { Notice } from '@app/core/model';


@Injectable({
  providedIn: 'root'
})
export class NoticesService extends FirestoreService<Notice> {

  constructor(protected afs: AngularFirestore) {
    super(afs, 'notices');
  }

  getQueryByProfileIdAndUnread(profileId: string) {
    return this.getQuery({
      where: [
        ['profileId', '==', profileId],
        ['read', '==', false]
      ],
      orderBy: [['created', 'desc']],
      limit: 100
    });
  }

  updateRead(noticeId: string) {
    return this.update(noticeId, { read: FirestoreService.serverTimestamp() });
  }
}
