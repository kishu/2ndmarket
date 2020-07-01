import { firestore } from 'firebase';

export interface Notice {
  id: string;
  profileId: string;
  goodsId: string;
  commentId: string;
  read: boolean | firestore.Timestamp;
  created: string;
}

export type NewNotice = Omit<Notice, 'id' | 'created'> & {
  created: firestore.FieldValue;
};
