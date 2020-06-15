import { firestore } from 'firebase/app';

export interface SignInEmail {
  id: string;
  email: string;
  verified: boolean;
  created: firestore.Timestamp;
}

export type NewSignInEmail = Omit<SignInEmail, 'id' | 'created'> & {
  created: firestore.FieldValue,
};
