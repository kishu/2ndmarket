import { firestore } from 'firebase';
import { Goods, GoodsRef } from './goods';

export interface GoodsFavorite {
  id: string;
  userId: string;
  goodsRef: GoodsRef;
  created: firestore.Timestamp;
}

export type NewGoodsFavorite = Omit<Comment, 'id' | 'created'> & {
  created: firestore.FieldValue
};


export type GoodsFavoriteRef = firestore.DocumentReference;

