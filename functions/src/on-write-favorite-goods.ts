import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const db = admin.firestore();

export const onWriteFavoriteGoods = functions
  .region('asia-northeast1')
  .firestore
  .document('favoriteGoods/{favoriteGoodsId}')
  .onWrite(async (change: any, context: any) => {
    const created = change.after.exists;
    const favoriteGoodsDoc = change.after.exists ? change.after : change.before;
    const favoriteGoodsData = favoriteGoodsDoc.data();
    const goodsDoc = await db.doc(`goods/${favoriteGoodsData.goodsId}`).get();
    const partialGoods= {
      favoritesCnt: admin.firestore.FieldValue.increment(created ? 1 : -1),
    };
    return goodsDoc.ref.update(partialGoods);
  });
