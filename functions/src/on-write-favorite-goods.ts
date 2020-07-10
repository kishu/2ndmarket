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
    const goodsData = goodsDoc.data();
    if (created && favoriteGoodsData.profileId === goodsData?.profileId) {
      const partialGoods= {
        favoritesCnt: admin.firestore.FieldValue.increment(1),
      };
      return goodsDoc.ref.update(partialGoods);
    } else if(created && favoriteGoodsData.profileId !== goodsData?.profileId) {
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
