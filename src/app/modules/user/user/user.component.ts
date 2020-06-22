import { Component, OnInit } from '@angular/core';
import { AuthService, GoodsService, UserGroupsService } from "@app/core/http";
import { first, switchMap } from "rxjs/operators";
import { combineLatest, Observable } from "rxjs";
import { Goods, Group, UserGroup } from "@app/core/model";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user$ = this.authService.user$;
  userGroups$ = this.authService.user$.pipe(
    first(),
    switchMap(u => this.userGroupsService.getAllByUserId(u.id)),
    switchMap(userGroups => {
      return combineLatest(
        userGroups.map(
          userGroup => userGroup.groupRef.get()
            .then(g => ({id: g.id, ...g.data()} as Group))
            .then(g => ({...userGroup, group: g} as UserGroup))
        )
      );
    })
  );
  goodsList$ = this.authService.user$.pipe(
    first(),
    switchMap(u => this.goodsService.getAllByUserId(u.id))
  );
  favoriteGoodsList$: Observable<Goods[]>;


  constructor(
    private authService: AuthService,
    private goodsService: GoodsService,
    private userGroupsService: UserGroupsService
  ) { }

  ngOnInit(): void {
  }

}
