import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const db = admin.firestore();

export const onWriteGoodsFavorites =
  functions
    .region('asia-northeast1')
    .firestore
    .document('goodsFavorites/{goodsFavoriteId}')
    .onWrite((change: any, context: any) => {
      const increment = change.after.exists ? 1 : -1;
      const doc = change.after.exists ? change.after.data() : change.before.data();
      const goodsRef = db.doc(`goods/${doc.goodsId}`)
      return goodsRef.update({
        favoritesCnt: admin.firestore.FieldValue.increment(increment),
        updated: admin.firestore.FieldValue.serverTimestamp()
      });
    });
