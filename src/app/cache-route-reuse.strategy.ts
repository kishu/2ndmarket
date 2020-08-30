import { RouteReuseStrategy } from '@angular/router/';
import { ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

/*
 * https://itnext.io/cache-components-with-angular-routereusestrategy-3e4c8b174d5f
 */
export class CacheRouteReuseStrategy implements RouteReuseStrategy {
  storedRouteHandles = new Map<string, DetachedRouteHandle>();
  allowRetrieveCache = {
    goods: false,
    'preference/written-goods': false,
    'preference/favorited-goods': false
  };

  private getPath(route: ActivatedRouteSnapshot): string {
    if (route.routeConfig !== null && route.routeConfig.path !== null) {
      return route.routeConfig.path;
    }
    return '';
  }

  shouldReuseRoute(before: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    switch (this.getPath(curr)) {
      case 'goods':
        console.log(before);
        this.allowRetrieveCache.goods = this.getPath(before) === 'goods/:goodsId';
        break;
      case 'preference/written-goods':
        this.allowRetrieveCache['preference/written-goods'] = this.getPath(before) === 'goods/:goodsId';
        break;
      case 'preference/favorited-goods':
        this.allowRetrieveCache['preference/favorited-goods'] = this.getPath(before) === 'goods/:goodsId';
        break;
    }
    return before.routeConfig === curr.routeConfig;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return this.storedRouteHandles.get(this.getPath(route)) as DetachedRouteHandle;
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const path = this.getPath(route);
    if (this.allowRetrieveCache[path]) {
      return this.storedRouteHandles.has(this.getPath(route));
    }
    return false;
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const path = this.getPath(route);
    return this.allowRetrieveCache.hasOwnProperty(path);
  }

  store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
    this.storedRouteHandles.set(this.getPath(route), detachedTree);
  }
}
