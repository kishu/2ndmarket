import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private handlers: { [key: string]: DetachedRouteHandle } = {};

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    if (!route.routeConfig || route.routeConfig.loadChildren) {
      return false;
    }
    let shouldReuse = false;
    if (route.routeConfig.data) {
      route.routeConfig.data.reuse ? shouldReuse = true : shouldReuse = false;
    }
    return shouldReuse;
  }

  store(route: ActivatedRouteSnapshot, handler: DetachedRouteHandle): void {
    if (handler) {
      this.handlers[this.getUrl(route)] = handler;
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !!this.handlers[this.getUrl(route)];
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    if (!route.routeConfig || route.routeConfig.loadChildren) {
      return null;
    }
    return this.handlers[this.getUrl(route)];
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, current: ActivatedRouteSnapshot): boolean {
    let reUseUrl = false;
    if (future.routeConfig) {
      if (future.routeConfig.data) {
        reUseUrl = future.routeConfig.data.reuse;
      }
    }
    const defaultReuse = (future.routeConfig === current.routeConfig);
    return reUseUrl || defaultReuse;
  }

  getUrl(route: ActivatedRouteSnapshot): string {
    if (route.routeConfig) {
      return route.routeConfig.path;
    }
  }

}
