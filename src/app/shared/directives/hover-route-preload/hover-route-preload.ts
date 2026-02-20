import { Directive, inject, input } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterPreloader, UrlTree } from '@angular/router';
import { take } from 'rxjs/operators';

import { LinkTo } from '../../components/atomic-link/atomic-link.utils';
import { HoverRoutePreloadState } from '../../preloading/hover-route-preload-state';

@Directive({
  selector: 'a[appHoverRoutePreload]',
  host: {
    '(pointerenter)': 'triggerPreload()',
    '(focusin)': 'triggerPreload()',
  },
})
export class HoverRoutePreloadDirective {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly routerPreloader = inject(RouterPreloader);
  private readonly preloadState = inject(HoverRoutePreloadState);

  /* eslint-disable @angular-eslint/no-input-rename */
  to = input<LinkTo>(null, { alias: 'appHoverRoutePreload' });
  queryParams = input<Params | null | undefined>(undefined, {
    alias: 'appHoverRoutePreloadQueryParams',
  });
  fragment = input<string | undefined>(undefined, { alias: 'appHoverRoutePreloadFragment' });
  /* eslint-enable @angular-eslint/no-input-rename */

  protected triggerPreload(): void {
    const preloadKey = this.resolvePreloadKey();

    if (!preloadKey || !this.preloadState.requestPreload(preloadKey)) {
      return;
    }

    this.routerPreloader.preload().pipe(take(1)).subscribe();
  }

  private resolvePreloadKey(): string | null {
    const urlTree = this.resolveUrlTree();

    if (!urlTree) {
      return null;
    }

    const primaryOutlet = urlTree.root.children['primary'];
    const firstPathSegment = primaryOutlet?.segments[0]?.path;

    return firstPathSegment ?? null;
  }

  private resolveUrlTree(): UrlTree | null {
    const to = this.to();

    if (!to) {
      return null;
    }

    if (to instanceof UrlTree) {
      return to;
    }

    const commands = Array.isArray(to) ? to : [to];

    return this.router.createUrlTree(commands, {
      relativeTo: this.activatedRoute,
      queryParams: this.queryParams() ?? undefined,
      fragment: this.fragment(),
    });
  }
}
