import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const db = admin.firestore();

export const onWriteGoodsFavorites = functions
  .region('asia-northeast1')
  .firestore
  .document('goodsFavorites/{goodsFavoriteId}')
  .onWrite(async (change: any, context: any) => {
    const created = change.after.exists;
    const goodsFavoriteDoc = change.after.exists ? change.after : change.before;
    const goodsFavoriteData = goodsFavoriteDoc.data();
    const goodsDoc = await db.doc(`goods/${goodsFavoriteData.goodsId}`).get();
    const goodsData = goodsDoc.data();
    if (created && goodsFavoriteData.profileId === goodsData?.profileId) {
      const partialGoods= {
        favoritesCnt: admin.firestore.FieldValue.increment(1),
      };
      return goodsDoc.ref.update(partialGoods);
    } else if(created && goodsFavoriteData.profileId !== goodsData?.profileId) {
      const partialGoods= {
        favoritesCnt: admin.firestore.FieldValue.increment(1),
        updated: admin.firestore.FieldValue.serverTimestamp()
      }
      return goodsDoc.ref.update(partialGoods);
    } else if(!created) {
      const partialGoods= {
        favoritesCnt: admin.firestore.FieldValue.increment(-1),
      };
      return goodsDoc.ref.update(partialGoods);
    }

    return;
  });
