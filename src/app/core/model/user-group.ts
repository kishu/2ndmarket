import { firestore } from "firebase/app";
import { Group, GroupRef } from './group';

export interface UserGroup {
  id: string;
  userId: string;
  groupRef: GroupRef;
  created: firestore.Timestamp;
}

export interface UserGroupExt extends UserGroup {
  group: Group;
}

export type NewUserGroup = Omit<UserGroup, 'id' | 'created'> & {
  created: firestore.FieldValue
};

export type UserGroupRef = firestore.DocumentReference;
