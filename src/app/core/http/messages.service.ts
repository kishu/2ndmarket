import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '@app/core/http/firestore.service';
import { Message } from '@app/core/model';


@Injectable({
  providedIn: 'root'
})
export class MessagesService extends FirestoreService<Message> {

  constructor(protected afs: AngularFirestore) {
    super(afs, 'messages');
  }

  valueChangesQueryByProfileId(profileId: string) {
    return super.valueChangesQuery({
      where: [
        ['profileId', '==', profileId]
      ],
      orderBy: [['created', 'desc']],
      limit: 100
    });
  }

  getQueryByProfileIdAndUnread(profileId: string) {
    return super.getQuery({
      where: [
        ['profileId', '==', profileId],
        ['read', '==', false]
      ],
      orderBy: [['created', 'desc']],
      limit: 100
    });
  }

  valueChangesQueryByProfileIdAndUnread(profileId: string) {
    return super.valueChangesQuery({
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
