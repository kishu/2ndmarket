import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export const onWriteGoodsComments =
  functions
    .region('asia-northeast1')
    .firestore
    .document('goodsComments/{goodsCommentId}')
    .onWrite((change: any, context: any) => {
      const increment = change.after.exists ? 1 : -1;
      const doc = change.after.exists ? change.after.data() : change.before.data();
      return doc.goodsRef.update({ commentsCnt: admin.firestore.FieldValue.increment(increment), updated: admin.firestore.FieldValue.serverTimestamp() });
    });
