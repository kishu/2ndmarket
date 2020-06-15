import { firestore } from 'firebase/app';

export interface User {
  id: string;
  displayName: string;
  photoURL: string;
  email: string;
  emailVerified: boolean;
}

export type UserRef = firestore.DocumentReference;
