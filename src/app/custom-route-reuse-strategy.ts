import { ActivatedRouteSnapshot, RouteReuseStrategy, DetachedRouteHandle } from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {

  //  Specify the routes to reuse/cache in an array.
  routesToCache: string[] = ['goods', 'preference/profile'];

  storedRouteHandles = new Map<string, DetachedRouteHandle>();

  //  Decides if the route should be stored
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return this.routesToCache.indexOf(this.getPath(route)) > -1;
  }

  // Store the information for the route we're destructing
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    this.storedRouteHandles.set(this.getPath(route), handle);
  }

  // Return true if we have a stored route object for the next route
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return this.storedRouteHandles.has(this.getPath(route));
  }

  // If we returned true in shouldAttach(), now return the actual route data for restoration
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    return this.storedRouteHandles.get(this.getPath(route)) as DetachedRouteHandle;
  }

  // Reuse the route if we're going to and from the same route
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  //  Helper method to return a path,
  //  since javascript map object returns an object or undefined.
  private getPath(route: ActivatedRouteSnapshot): string {
    let path = '';
    if (route.routeConfig != null && route.routeConfig.path != null) {
      path = route.routeConfig.path;
    }
    return path;
  }

}
