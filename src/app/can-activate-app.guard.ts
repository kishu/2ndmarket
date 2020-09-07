import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@app/core/http';

@Injectable({
  providedIn: 'root'
})
export class CanActivateAppGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    console.log('app guard');
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

}
