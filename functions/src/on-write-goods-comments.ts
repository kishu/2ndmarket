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
      const goodsRef = db.doc(`goods/${doc.goodsId}`)
      return goodsRef.update({
        commentsCnt: admin.firestore.FieldValue.increment(increment),
        updated: admin.firestore.FieldValue.serverTimestamp() }
      );
    });
