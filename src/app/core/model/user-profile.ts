import { firestore } from "firebase/app";

export interface UserProfile {
  id: string;
  userId: string;
  userEmail: string;
  profileId: string;
  activated: boolean;
  created: firestore.Timestamp;
}

export type NewUserProfile = Omit<UserProfile, 'id' | 'created'> & {
  created: firestore.FieldValue
};
