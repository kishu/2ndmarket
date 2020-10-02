import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
const db = admin.firestore();

export const onWriteGoodsComments = functions
    .region('asia-northeast1')
    .firestore
    .document('goodsComments/{goodsCommentId}')
    .onWrite(async (change: any, context: any) => {
      const promises: Promise<any>[] = [] ;
      const created = !change.before.exists() && change.after.exists();
      const updated = change.before.exists() && change.after.exists();
      const deleted = change.before.exists() && !change.after.exists();

      const goodsCommentDoc = (created || updated) ? change.after : change.before;
      const goodsCommentData = goodsCommentDoc.data();
      const goodsDoc = await db.doc(`goods/${goodsCommentData.goodsId}`).get();
      const goodsData = goodsDoc.data();

      const partialGoods= { commentsCnt: admin.firestore.FieldValue.increment(created ? 1 : -1) };
      promises.push(goodsDoc.ref.update(partialGoods));

      if (created && goodsCommentData.profileId !== goodsData?.profileId) {
        const newMessage = {
          profileId: goodsData?.profileId,
          goodsId: goodsDoc.id,
          goodsCommentId: goodsCommentDoc.id,
          read: false,
          created: admin.firestore.FieldValue.serverTimestamp()
        }
        promises.push(db.collection('messages').add(newMessage));
      }

      if (deleted) {
        const deleteMessages = db.collection('messages')
          .where('goodsCommentId', '==', goodsCommentDoc.id)
          .get()
          .then(querySnapshot => {
            const batch = db.batch();
            querySnapshot.docs.forEach(doc => batch.delete(doc.ref));
            return batch.commit();
          });
        promises.push(deleteMessages);
      }

      return Promise.all(promises);
    });
