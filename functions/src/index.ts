// https://firebase.google.com/docs/functions/typescript

import * as functions from 'firebase-functions';
import * as sgMail from '@sendgrid/mail';

sgMail.setApiKey(functions.config().sendgrid.key);

export const sendVerificationEmail = functions.https.onRequest((request, response) => {
  // const {to, code} = request.body.data;
  const msg = {
    to: '',
    from: 'test@example.com',
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };

});


// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
