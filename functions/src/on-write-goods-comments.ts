import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Goods, GoodsComment, NewNotice } from '../../src/app/core/model';

const db = admin.firestore();

type PartialGoods = Partial<Omit<Partial<Goods>, 'commentsCnt' | 'updated'> & {
  commentsCnt: admin.firestore.FieldValue,
  updated: admin.firestore.FieldValue
}>;

export const onWriteGoodsComments =
  functions
    .region('asia-northeast1')
    .firestore
    .document('goodsComments/{goodsCommentId}')
    .onWrite(async (change: any, context: any) => {
      const created = change.after.exists;
      const goodsCommentDoc = change.after.exists ? change.after : change.before;
      const goodsCommentData = goodsCommentDoc.data() as Omit<GoodsComment, 'id'>;
      const goodsDoc = await db.doc(`goods/${goodsCommentData.goodsId}`).get();
      const goodsData = goodsDoc.data() as Omit<Goods, 'id'>;
      if (created && goodsCommentData.profileId !== goodsData.profileId) {
        const partialGoods: PartialGoods = {
          commentsCnt: admin.firestore.FieldValue.increment(1),
          updated: admin.firestore.FieldValue.serverTimestamp()
        };
        const newNotice: NewNotice = {
          profileId: goodsData.profileId,
          goodsId: goodsDoc.id,
          commentId: goodsCommentDoc.id,
          read: false,
          created: admin.firestore.FieldValue.serverTimestamp()
        }
        return Promise.all([
          goodsDoc.ref.update(partialGoods),
          db.collection('notices').add(newNotice)
        ]);
      } else {
        const partialGoods: PartialGoods = {
          commentsCnt: admin.firestore.FieldValue.increment(-1)
        };
        const deleteNotices = db.collection('notice')
          .where('commentId', '==', goodsCommentDoc.id)
          .get()
          .then(querySnapshot => Promise.all(querySnapshot.docs.map(doc => doc.ref.delete())));
        return Promise.all([
          goodsDoc.ref.update(partialGoods),
          deleteNotices
        ]);
      }
    });
