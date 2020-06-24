import { firestore } from 'firebase/app';

export interface UserAuth {
  id: string;
  authId: string;
  userId: string;
  activated: boolean;
  created: firestore.Timestamp;
}

export type NewUserAuth = Omit<UserAuth, 'id' | 'created'> & {
  created: firestore.FieldValue
}

export type NewUserAuthRef = firestore.DocumentReference;
