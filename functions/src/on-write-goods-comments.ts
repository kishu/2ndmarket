import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
const db = admin.firestore();

export const onWriteGoodsComments = functions
    .region('asia-northeast1')
    .firestore
    .document('goodsComments/{goodsCommentId}')
    .onWrite(async (change: any, context: any) => {
      const created = change.after.exists;
      const goodsCommentDoc = change.after.exists ? change.after : change.before;
      const goodsCommentData = goodsCommentDoc.data();
      const goodsDoc = await db.doc(`goods/${goodsCommentData.goodsId}`).get();
      const goodsData = goodsDoc.data();
      if (created && goodsCommentData.profileId !== goodsData?.profileId) {
        const partialGoods= {
          commentsCnt: admin.firestore.FieldValue.increment(1),
          updated: admin.firestore.FieldValue.serverTimestamp()
        };
        const newNotice = {
          profileId: goodsData?.profileId,
          goodsId: goodsDoc.id,
          goodsCommentId: goodsCommentDoc.id,
          read: false,
          created: admin.firestore.FieldValue.serverTimestamp()
        }
        return Promise.all([
          goodsDoc.ref.update(partialGoods),
          db.collection('notices').add(newNotice)
        ]);
      } else if(!created) {
        const partialGoods = {
          commentsCnt: admin.firestore.FieldValue.increment(-1)
        };
        const deleteNotices = db.collection('notice')
          .where('goodsCommentId', '==', goodsCommentDoc.id)
          .get()
          .then(querySnapshot => Promise.all(querySnapshot.docs.map(doc => doc.ref.delete())));
        return Promise.all([
          goodsDoc.ref.update(partialGoods),
          deleteNotices
        ]);
      }
      return Promise.resolve();
    });
