import { Injectable } from '@angular/core';
import { AuthService, GoodsService } from "@app/core/http";
import { forkJoin, of } from "rxjs";
import { switchMap, tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class GoodsPersistenceService {
  goods$ = this.authService.profile$.pipe(
    switchMap(profile => profile ?
      this.goodsService.valueChangesByGroupId(profile.groupId) :
      of(null)
    ),
    tap(goods => console.log('pers', goods))
  );

  constructor(
    private authService: AuthService,
    private goodsService: GoodsService
  ) { }
}
