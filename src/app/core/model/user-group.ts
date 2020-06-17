import { firestore } from "firebase/app";
import { Group, GroupRef } from './group';

export interface UserGroup {
  id: string;
  userId: string;
  groupRef: GroupRef;
  group?: Group;
  activated: boolean;
  created: firestore.Timestamp;
  updated: firestore.Timestamp;
}

export type NewUserGroup = Omit<UserGroup, 'id' | 'group' | 'created' | 'updated'> & {
  created: firestore.FieldValue,
  updated: firestore.FieldValue
};

export type UserGroupRef = firestore.DocumentReference;
