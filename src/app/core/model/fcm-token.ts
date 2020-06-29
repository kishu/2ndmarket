import { firestore } from 'firebase/app';

export interface FcmToken {
  id: string;
  profileId: string;
  token: string;
  created: firestore.Timestamp;
}

export type NewFcmToken = Omit<FcmToken, 'id' | 'created'> & {
  created: firestore.FieldValue,
};
