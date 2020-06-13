import * as functions from 'firebase-functions';
import * as sgMail from '@sendgrid/mail';
import * as cors from 'cors';

const corsHandler = cors({origin: true});
sgMail.setApiKey(functions.config().sendgrid.key);

export const sendVerificationEmail = functions
  .region('asia-northeast1')
  .https.onRequest((req, res) => {
    return corsHandler(req, res, () => {
      const {to, code} = req.body.data;
      const msg = {
        to,
        from: {
          email: 'auth@2ndmarket.co',
          name: '세컨드마켓'
        },
        templateId: 'd-62ffa28feedc4308ad1097ed864b2d52',
        dynamic_template_data: { code }
      };
      sgMail.send(msg).then(() => {
        res.send({ data: '' });
      }).catch(err => {
        res.status(500).send(err);
      });
    });
});
