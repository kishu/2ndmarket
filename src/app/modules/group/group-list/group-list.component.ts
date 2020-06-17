import { Component, OnInit } from '@angular/core';
import { AuthService, GroupsService, UserGroupsService } from "@app/core/http";
import { combineLatest, concat, forkJoin, from, merge, Observable, of, zip } from "rxjs";
import { concatMap, first, map, switchMap, tap } from "rxjs/operators";
import { Group, UserGroup } from "@app/core/model";
import { AngularFirestore } from "@angular/fire/firestore";
import { fromPromise } from "rxjs/internal-compatibility";
import { firestore } from "firebase/app";

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {
  userGroupList$: Observable<UserGroup[]>;
  constructor(
    private authService: AuthService,
    private groupsService: GroupsService,
    private userGroupsService: UserGroupsService
  ) {
    this.userGroupList$ = this.authService.user$
      .pipe(
        first(),
        switchMap(u => this.userGroupsService.getAllByUserId(u.id)),
        switchMap(userGroups => {
          const test = userGroups.map(userGroup => {
            return userGroup.groupRef.get().then(g => ({id: g.id, ...g.data()}));
          });
          return zip(of(userGroups), forkJoin(test));
        }),
        tap(r => console.log(r)),
        map(([userGroups, groups]) => {
          return userGroups.map((userGroup, i) => {
            userGroup.group = groups[i] as Group;
            return userGroup;
          });
        })
      )
  }

  ngOnInit(): void {
  }

}
