import { firestore } from 'firebase';
import { GoodsRef } from './goods';

export interface GoodsComment {
  id: string;
  userId: string;
  goodsRef: GoodsRef;
  body: string;
  created: firestore.Timestamp;
}

export type NewGoodsComment = Omit<GoodsComment, 'id' | 'created'> & {
  created: firestore.FieldValue
};

export type GoodsCommentRef = firestore.DocumentReference;
