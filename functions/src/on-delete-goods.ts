import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
const db = admin.firestore();

export const onDeleteGoods = functions
  .region('asia-northeast1')
  .firestore
  .document('goods/{goodsId}')
  .onDelete(async (snap: any, context: any) => {
    const goodsId = context.params.goodsId;
    const movePromise = db.collection('deletedGoods').doc(goodsId).set(snap.data());
    const deleteBatch = db.batch();
    const qs = await db
      .collection('favoriteGoods')
      .where('goodsId', '==', goodsId)
      .get();
    qs.forEach(d => deleteBatch.delete(d.ref));
    return Promise.all([movePromise, deleteBatch.commit()]);
  });
