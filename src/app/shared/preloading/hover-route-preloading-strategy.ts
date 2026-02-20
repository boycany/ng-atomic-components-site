import { Injectable, inject } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { tap } from 'rxjs/operators';

import { HoverRoutePreloadState } from './hover-route-preload-state';

@Injectable({ providedIn: 'root' })
export class HoverRoutePreloadingStrategy implements PreloadingStrategy {
  private readonly preloadState = inject(HoverRoutePreloadState);

  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    const preloadOnHover = route.data?.['preloadOnHover'] === true;
    const preloadKey = route.data?.['preloadKey'];

    if (!preloadOnHover || typeof preloadKey !== 'string') {
      return EMPTY;
    }

    if (!this.preloadState.canStartPreload(preloadKey)) {
      return EMPTY;
    }

    this.preloadState.markLoading(preloadKey);

    return load().pipe(tap(() => this.preloadState.markLoaded(preloadKey)));
  }
}
