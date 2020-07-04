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

  getQueryByRead(read: boolean) {
    return this.getQuery({
      where: [['read', '==', read]],
      orderBy: [['created', 'desc']],
      limit: 100
    });
  }

  updateRead(noticeId: string) {
    return this.update(noticeId, { read: FirestoreService.serverTimestamp() });
  }
}
