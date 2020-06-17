import { combineLatest, forkJoin, Observable, zip } from "rxjs";
import { first, switchMap } from "rxjs/operators";
import { Component, OnInit } from '@angular/core';
import { AuthService, GroupsService, UserGroupsService } from "@app/core/http";
import { Group, UserGroup } from "@app/core/model";

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
          return combineLatest(
            userGroups.map(
              userGroup => userGroup.groupRef.get()
                .then(g => ({ id: g.id, ...g.data() } as Group))
                .then(g => ({ ...userGroup, group: g } as UserGroup))
              )
          );
        })
      );
  }

  ngOnInit(): void {
  }

}
