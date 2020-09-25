import { firestore } from 'firebase';
import { Group } from '@app/core/model/group';
import { Profile } from '@app/core/model/profile';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
}

export interface UserInfo {
  id: string; // userId
  profileId: string;
}

export interface User2 {
  id: string;
  uid: string; // sns login id
  groupId: string;
  primary: boolean;
  activated: boolean;
  authKey: string;
  displayName: string;
  photoURL: string;
  created: firestore.Timestamp;
}

export interface User2Ext extends User2 {
  group: Group;
}

export type NewUser2 = Omit<Profile, 'id' | 'created'> & {
  created: firestore.FieldValue;
};
