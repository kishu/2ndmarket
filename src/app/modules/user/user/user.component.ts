import { Component, OnInit } from '@angular/core';
import { AuthService, GoodsFavoritesService, GoodsService, UserGroupsService } from "@app/core/http";
import { filter, first, map, share, switchMap } from "rxjs/operators";
import { forkJoin, Observable } from "rxjs";
import { Group, UserGroupExt } from "@app/core/model";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user$ = this.authService.user$.pipe(first(), filter(u => !!u), share());
  userGroups$: Observable<UserGroupExt[]> = this.authService.user$.pipe(
    switchMap(u => this.userGroupsService.getAllByUserId(u.id).pipe(first())),
    map(ugs => ugs.map(ug => ug.groupRef.get().then(g => ({ id: g.id, ...g.data() })).then(g => ({...ug, group: g})) )),
    switchMap(ugs => forkJoin(...ugs))
  );
  goodsList$ = this.authService.user$.pipe(
    switchMap(u => this.goodsService.getAllByUserId(u.id))
  );
  favoriteGoodsList$ = this.authService.user$.pipe(
    switchMap(u => this.goodsFavoriteService.getAllByUserId(u.id).pipe(first())),
    map(fs => fs.map(f => f.goodsRef.get().then(g => ({id: g.id, ...g.data()})))),
    switchMap(gs => forkJoin(...gs))
  );

  constructor(
    private authService: AuthService,
    private goodsService: GoodsService,
    private userGroupsService: UserGroupsService,
    private goodsFavoriteService: GoodsFavoritesService
  ) {
  }

  ngOnInit(): void {
  }

}
