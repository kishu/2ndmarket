import { Injectable } from '@angular/core';
import { FirestoreService} from "@app/core/http/firestore.service";
import { AngularFirestore} from "@angular/fire/firestore";
import { SignInEmail } from "@app/core/model";

@Injectable({
  providedIn: 'root'
})
export class SignInEmailService extends FirestoreService<SignInEmail> {

  constructor(protected afs: AngularFirestore) {
    super(afs, 'signInEmails');
  }

}
