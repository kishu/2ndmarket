import { firestore } from 'firebase';
import { Goods } from '@app/core/model/goods';
import { GoodsComment } from '@app/core/model/goods-comment';

export interface Message {
  id: string;
  profileId: string;
  goodsId: string;
  goodsCommentId: string;
  read: boolean | firestore.Timestamp;
  created: firestore.Timestamp;
}

export interface MessageExt extends Message {
  goods: Goods;
  goodsComment: GoodsComment;
}

export type NewMessage = Omit<Message, 'id' | 'created'> & {
  created: firestore.FieldValue;
};
