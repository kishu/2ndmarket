import firestore from 'firebase/firebase-firestore';

export interface GoodsComment {
  id: string;
  userId: string;
  profileId: string;
  goodsId: string;
  body: string;
  created: firestore.Timestamp;
}

export type NewGoodsComment = Omit<GoodsComment, 'id' | 'created'> & {
  created: firestore.FieldValue;
};
