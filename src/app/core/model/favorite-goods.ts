import firestore from 'firebase/firebase-firestore';

export interface FavoriteGoods {
  id: string;
  userId: string;
  profileId: string;
  goodsId: string;
  created: firestore.Timestamp;
}

export type NewFavoriteGoods = Omit<FavoriteGoods, 'id' | 'created'> & {
  created: firestore.FieldValue;
};
