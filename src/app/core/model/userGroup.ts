import { firestore } from "firebase";
import { UserRef } from './user';
import { GroupRef } from './group';

export interface UserGroup {
  id: string;
  userRef: UserRef;
  groupRef: GroupRef[];
  created: firestore.Timestamp;
  updated: firestore.Timestamp;
}

export type NewUserGroup = Omit<UserGroup, 'id' | 'created' | 'updated'> & {
  created: firestore.FieldValue,
  updated: firestore.FieldValue
};
export type UserGroupRef = firestore.DocumentReference;
