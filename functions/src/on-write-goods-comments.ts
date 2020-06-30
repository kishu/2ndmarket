import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const db = admin.firestore();

export const onWriteGoodsComments =
  functions
    .region('asia-northeast1')
    .firestore
    .document('goodsComments/{goodsCommentId}')
    .onWrite((change: any, context: any) => {
      const increment = change.after.exists ? 1 : -1;
      const doc = change.after.exists ? change.after.data() : change.before.data();
      return db.doc(`goods/${doc.goodsId}`).get().then(goods => {
        let update;
        if (change.after.exists && doc.profileId !== goods.get('profileId')) {
          update = {
            commentsCnt: admin.firestore.FieldValue.increment(increment),
            updated: admin.firestore.FieldValue.serverTimestamp()
          }
        } else {
          update = {
            commentsCnt: admin.firestore.FieldValue.increment(increment)
          };
        }
        return goods.ref.update(update);
      });
    });
