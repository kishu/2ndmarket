import { firestore } from 'firebase/app';
import { Group } from '@app/core/model/group';

export interface Profile {
  id: string;
  groupId: string;
  displayName: string;
  email: string;
  photoURL: string;
  created: firestore.Timestamp;
}

export interface ProfileExt extends Profile {
  group: Group;
}

export type NewProfile = Omit<Profile, 'id' | 'created'> & {
  created: firestore.FieldValue;
};
