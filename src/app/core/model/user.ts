import { firestore } from 'firebase/app';

export interface User {
  id: string;
  displayName: string;
  photoURL: string;
  email: string;
}

export type NewUser = Omit<User, 'id'>;
export type UserRef = firestore.DocumentReference;
