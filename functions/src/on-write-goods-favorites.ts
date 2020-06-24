import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export const onWriteGoodsFavorites =
  functions
    .region('asia-northeast1')
    .firestore
    .document('goodsFavorites/{goodsFavoriteId}')
    .onWrite((change: any, context: any) => {
      const increment = change.after.exists ? 1 : -1;
      const doc = change.after.exists ? change.after.data() : change.before.data();
      return doc.goodsRef.update({ favoritesCnt: admin.firestore.FieldValue.increment(increment) });
    });
