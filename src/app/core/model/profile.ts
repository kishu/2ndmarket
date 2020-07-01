import { firestore } from 'firebase/app';

export interface Profile {
  id: string;
  groupId: string;
  displayName: string;
  email: string;
  photoURL: string;
  created: firestore.Timestamp;
}

export type NewProfile = Omit<Profile, 'id' | 'created'> & {
  created: firestore.FieldValue;
};
