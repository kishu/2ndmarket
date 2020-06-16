import { firestore } from "firebase/app";
import { GroupRef } from './group';

export interface UserGroup {
  id: string;
  userId: string;
  groupRefs: GroupRef[];
  created: firestore.Timestamp;
  updated: firestore.Timestamp;
}

export type NewUserGroup = Omit<UserGroup, 'id' | 'created' | 'updated'> & {
  created: firestore.FieldValue,
  updated: firestore.FieldValue
};

export type UpdatedUserGroup = Omit<UserGroup, 'id' | 'userId' | 'groupRefs' | 'created' | 'updated'> & {
  groupRefs: firestore.FieldValue,
  updated: firestore.FieldValue
};

export type UserGroupRef = firestore.DocumentReference;
