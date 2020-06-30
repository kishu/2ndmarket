import { firestore } from 'firebase/app';

/*
 * deprecated
 */
export enum GoodsCategory {
  appliances = 'appliances',  // 가전제품, 디지털
  household = 'household',    // 생활용품
  beauty = 'beauty',          // 뷰티
  home = 'home',              // 홈데코
  women = 'women',            // 여성의류
  man = 'man',                // 남성의류
  fashion = 'fashion',        // 패션잡화
  luxury = 'luxury',          // 명품, 주얼리
  kids = 'kids'               // 유아, 출산
}

export enum GoodsPurchased {
  unknown = 'unknown',        // 알 수 없음
  week = 'week',              // 일주일 이내
  month = 'month',            // 한 달 이내
  threeMonth = 'threeMonth',  // 석 달 이내
  year = 'year',              // 일 년 이내
  longAgo = 'longAgo'         // 오래전
}

export enum GoodsCondition {
  boxed = 'boxed',            // 미개봉
  almostNew = 'almostNew',    // 거의 새상품
  used = 'used'               // 사용감 있음
}

export enum GoodsShipping {
  directly = 'directly',      // 직거래
  delivery = 'delivery',      // 택배
  etc = 'etc'                 // 기타 다른 방법
}

export interface Goods {
  id: string;
  userId: string;
  groupId: string;
  profileId: string;
  name: string;
  shared: boolean;
  purchased: GoodsPurchased;
  condition: GoodsCondition;
  price: number;
  shipping: GoodsShipping;
  images: string/* url */[];
  contact: string;
  memo: string;
  favoritesCnt: number;
  commentsCnt: number;
  activated: boolean;
  soldOut: boolean | firestore.Timestamp;
  created: firestore.Timestamp;
  updated: firestore.Timestamp;
  processing: boolean;
}

export type NewGoods = Omit<Goods, 'id' | 'created' | 'updated'> & {
  created: firestore.FieldValue,
  updated: firestore.FieldValue
};

export type UpdateGoods = Omit<Partial<Goods>, 'updated'> & {
  updated: firestore.FieldValue;
};
