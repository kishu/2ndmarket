import { forkJoin, Observable } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService, GoodsService } from '@app/core/http';

@Injectable({
  providedIn: 'root'
})
export class PermitGoodsGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private goodsService: GoodsService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const goodsId = next.paramMap.get('goodsId');
    return forkJoin([
      this.authService.profileExt$.pipe(first()),
      this.goodsService.get(goodsId).pipe(first())
    ]).pipe(
      map(([p, g]) => p.id === g.profileId),
      tap(activated => !activated && this.router.navigate(['/goods', goodsId]))
    );
  }

}
