import { firestore } from 'firebase';

export interface Notice {
  id: string;
  profileId: string;
  goodsId: string;
  goodsCommentId: string;
  read: boolean | firestore.Timestamp;
  created: firestore.Timestamp;
}

export type NewNotice = Omit<Notice, 'id' | 'created'> & {
  created: firestore.FieldValue;
};
