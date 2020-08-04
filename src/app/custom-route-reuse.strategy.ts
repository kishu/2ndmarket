import { RouteReuseStrategy } from '@angular/router/';
import { ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  storedRouteHandles = new Map<string, DetachedRouteHandle>();
  allowRetriveCache = {
    goods: true
  };

  private static getPath(route: ActivatedRouteSnapshot): string {
    if (route.routeConfig !== null && route.routeConfig.path !== null) {
      return route.routeConfig.path;
    }
    return '';
  }

  shouldReuseRoute(before: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    this.allowRetriveCache['search-results'] =
      CustomRouteReuseStrategy.getPath(before) === 'goods/:goodsId' &&
      CustomRouteReuseStrategy.getPath(curr) === 'goods';
    return before.routeConfig === curr.routeConfig;
  }
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return this.storedRouteHandles.get(CustomRouteReuseStrategy.getPath(route)) as DetachedRouteHandle;
  }
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const path = CustomRouteReuseStrategy.getPath(route);
    if (this.allowRetriveCache[path]) {
      return this.storedRouteHandles.has(CustomRouteReuseStrategy.getPath(route));
    }

    return false;
  }
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const path = CustomRouteReuseStrategy.getPath(route);
    return this.allowRetriveCache.hasOwnProperty(path);

  }
  store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
    this.storedRouteHandles.set(CustomRouteReuseStrategy.getPath(route), detachedTree);
  }

}
