// import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as cloudinary from 'cloudinary';
// import * as url from 'url';
// import * as path from 'path';

cloudinary.v2.config({
  cloud_name: 'dhtyfa1la',
  api_key: functions.config().cloudinary.key,
  api_secret: functions.config().cloudinary.secret,
});

export const onDeleteGoods =
  functions
    .region('asia-northeast1')
    .firestore
    .document('goods/{goodsId}')
    .onDelete((snap: any, context: any) => {
      // const images: string[] = snap.data().images || [];
      // const public_ids = images.map(img => path.parse(url.parse(img).pathname as string).name);
      const public_ids = ['wjqrgwdaiifaehtiha3e.jpg'];
      return cloudinary.v2.api.delete_resources(public_ids, (err, res) => {
        console.log('err', err);
        console.log('res', res);
      }).then(
        r => console.log('r', r),
        e => console.log('e', e)
      );
    });
