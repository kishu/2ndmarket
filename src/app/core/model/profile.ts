import { firestore } from 'firebase/app';
import { Group } from '@app/core/model/group';

export interface Profile2 {
  id: string;
  userId: string;
  email: string;
  displayName: string;
  photoURL: string;
  created: firestore.Timestamp;
}

export type NewProfile2 = Omit<Account, 'id' | 'created'> & {
  created: firestore.FieldValue;
};

export interface Profile {
  id: string;
  groupId: string;
  displayName: string;
  email: string;
  photoURL: string;
  userIds: string[];
  created: firestore.Timestamp;
}

export interface ProfileExt extends Profile {
  group: Group;
}

export type NewProfile = Omit<Profile, 'id' | 'created'> & {
  created: firestore.FieldValue;
};
