import { firestore } from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';

// export enum GroupType {
//   corp = 'corp',
//   school = 'school',
//   apt = 'apt'
// }

export interface Group {
  id: string;
  domains: [string];
  name: string;
  // type: GroupType;
}

export type NewGroup = Omit<Group, 'id'>;
export type GroupRef = firestore.DocumentReference;
