import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const db = admin.firestore();

export const onWriteFavoriteGoods = functions
  .region('asia-northeast1')
  .firestore
  .document('favoriteGoods/{favoriteGoodsId}')
  .onWrite(async (change: any, context: any) => {
    const created = !change.before.exists() && change.after.exists();
    const updated = change.before.exists() && change.after.exists();
    const deleted = change.before.exists() && !change.after.exists();
    const favoriteGoodsDoc = (created || updated) ? change.after : change.before;
    const favoriteGoodsData = favoriteGoodsDoc.data();
    const increment = created ? 1 : deleted ? -1 : 0;
    const action = increment !== 0 ?
      db.collection('goods').doc(favoriteGoodsData.goodId).update({
        favoritesCnt: admin.firestore.FieldValue.increment(increment)
      }) :
      null;
    return action;
  });
