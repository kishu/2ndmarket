import { firestore } from 'firebase';

export interface GoodsFavorite {
  id: string;
  userId: string;
  profileId: string;
  goodsId: string;
  created: firestore.Timestamp;
}

export type NewGoodsFavorite = Omit<GoodsFavorite, 'id' | 'created'> & {
  created: firestore.FieldValue
};
