import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const db = admin.firestore();

// Cleans up the tokens that are no longer valid.
function cleanupTokens(response: any, tokens: any) {
  // For each notification we check if there was an error.
  const tokensDelete: any[] = [];
  response.results.forEach((result: any, index: number) => {
    const error = result.error;
    if (error) {
      console.error('Failure sending notification to', tokens[index], error);
      // Cleanup the tokens who are not registered anymore.
      if (error.code === 'messaging/invalid-registration-token' ||
        error.code === 'messaging/registration-token-not-registered') {
        const deleteTask = admin.firestore().collection('fcmTokens').doc(tokens[index]).delete();
        tokensDelete.push(deleteTask);
      }
    }
  });
  return Promise.all(tokensDelete);
}

export const onCreateGoodsComments =
  functions
  .region('asia-northeast1')
  .firestore
  .document('goodsComments/{goodsCommentId}')
  .onCreate(async (snapshot) => {
    const goodsId = snapshot.get('goodsId');
    const profileId = snapshot.get('profileId');
    const body = snapshot.get('body');
    const goods = await db.doc(`goods/${goodsId}`).get();
    if (goods.exists && goods.get('profileId') !== profileId) {
      const payload = {
        notification: {
          title: `[세컨드마켓] '${goods.get('name')}'에 새로운 댓글이 달렸습니다.`,
          body: body ? (body.length <= 100 ? body : body.substring(0, 97) + '...') : '',
          icon: goods.get('images')[0],
          click_action: `https://dev.2ndmarket.co/goods/${goods.id}`
        }
      };
      const allTokens = await admin.firestore().collection('fcmTokens').where('profileId', '==', goods.get('profileId')).get();
      const tokens: string[] = [];
      allTokens.forEach(doc => tokens.push(doc.get('token')));
      if (tokens.length > 0) {
        const response = await admin.messaging().sendToDevice(tokens, payload);
        await cleanupTokens(response, tokens);
      }
    }
  });
