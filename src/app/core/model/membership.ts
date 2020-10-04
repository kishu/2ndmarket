import { firestore } from 'firebase';
import { Group } from './group';
import { Profile2 } from './profile';

export interface Membership {
  id: string;
  userId: string; // sns login id
  userEmail: string; // sns login email
  groupId: string;
  profileId: string;
  activated: firestore.Timestamp;
  created: firestore.Timestamp;
}

export interface MembershipExt extends Membership {
  group: Group;
  profile: Profile2;
}

export type NewMembership = Omit<Membership, 'id' | 'created'> & {
  activated: firestore.FieldValue;
  created: firestore.FieldValue;
};


// "유저(firebase)는 '프로필'을 사용해 '그룹'의 '멤버'가 된다."

// 1. sns 로그인 -> Account.uid == uid && Account.activated == true인 Account 검색
//   1.1 Account 있다 -> 유저 확인 완료. 식별자로 Account.id 사용
//   1.2 Account 없다 -> 신규 Account. 그룹 가입. email 인증. Account.groupId == groupId && Account.email == email인 && Account.super == null인 Account 검색
//     1.2.1 Account(SuperAccount) 있다 -> 그룹 신규 서브 계정. Account.super = SuperAccount.id, Account.displayName, photoURL은 SuperAccount 값 복사 후 User2 등록
//     1.2.2 Account 없다 -> 그룹 신규 슈퍼 계정. Account.super = null, displayName, photoURL 초기값으로 Account 등록


// 1. Profiles.users[0]
//   1.1 Accounts.add({ super: null, ... profile except userIds });
// 2. Profiles.users[1 ... n ]
//   2.2 Accounts.add({ super: id of 1.1, ... profile except userIds });

