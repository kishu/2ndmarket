import { firestore } from "firebase/app";
import { Group, GroupRef } from './group';

export interface UserGroup {
  id: string;
  userId: string;
  groupRef: GroupRef;
  activated: boolean;
  created: firestore.Timestamp;
  updated: firestore.Timestamp;
}

export interface UserGroupExt extends UserGroup {
  group: Group;
}

export type NewUserGroup = Omit<UserGroup, 'id' | 'created' | 'updated'> & {
  created: firestore.FieldValue,
  updated: firestore.FieldValue
};

export type UserGroupRef = firestore.DocumentReference;
