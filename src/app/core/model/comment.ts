import { firestore } from 'firebase';
import { GoodsRef } from './goods';

export interface Comment {
  id: string;
  userId: string;
  goodsRef: GoodsRef;
  body: string;
  created: firestore.Timestamp;
}

export type NewComment = Omit<Comment, 'id' | 'created'> & {
  created: firestore.FieldValue
};

export type CommentRef = firestore.DocumentReference;
