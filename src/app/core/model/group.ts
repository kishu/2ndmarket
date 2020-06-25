// export enum GroupType {
//   corp = 'corp',
//   school = 'school',
//   apt = 'apt'
// }

export interface Group {
  id: string;
  domains: [string];
  name: string;
  // type: GroupType;
}

export type NewGroup = Omit<Group, 'id'>;
