import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DefaultUrlSerializer, provideRouter, Router, RouterPreloader } from '@angular/router';
import { of } from 'rxjs';

import { HoverRoutePreloadState } from '../../preloading/hover-route-preload-state';
import { HoverRoutePreloadDirective } from './hover-route-preload';
import { LinkTo } from '../../components/atomic-link/atomic-link.utils';

@Component({
  template: '',
})
class DummyPage {}

@Component({
  imports: [HoverRoutePreloadDirective],
  template:
    '<a [appHoverRoutePreload]="to" [appHoverRoutePreloadQueryParams]="queryParams" [appHoverRoutePreloadFragment]="fragment">Go</a>',
})
class HostComponent {
  to: LinkTo = ['/home'];
  queryParams: Record<string, string> | null = null;
  fragment: string | undefined;
}

const setup = async (initialInputs?: {
  to?: LinkTo;
  queryParams?: Record<string, string> | null;
  fragment?: string | undefined;
}) => {
  const preloadCalls = { count: 0 };
  const routerPreloaderStub: Pick<RouterPreloader, 'preload'> = {
    preload: () => {
      preloadCalls.count += 1;
      return of(void 0);
    },
  };

  await TestBed.configureTestingModule({
    imports: [HostComponent],
    providers: [
      provideRouter([
        {
          path: 'home',
          loadComponent: () => Promise.resolve(DummyPage),
          data: { preloadOnHover: true, preloadKey: 'home' },
        },
        {
          path: 'feature',
          loadComponent: () => Promise.resolve(DummyPage),
          data: { preloadOnHover: true, preloadKey: 'feature' },
        },
      ]),
      { provide: RouterPreloader, useValue: routerPreloaderStub },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(HostComponent);
  const router = TestBed.inject(Router);
  const preloadState = TestBed.inject(HoverRoutePreloadState);

  if (initialInputs?.to !== undefined) {
    fixture.componentInstance.to = initialInputs.to;
  }
  if (initialInputs?.queryParams !== undefined) {
    fixture.componentInstance.queryParams = initialInputs.queryParams;
  }
  if (initialInputs?.fragment !== undefined) {
    fixture.componentInstance.fragment = initialInputs.fragment;
  }

  fixture.detectChanges();

  const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;

  return { fixture, router, preloadState, preloadCalls, anchor };
};

describe('HoverRoutePreloadDirective', () => {
  it('triggers preload once on pointerenter for the same route key', async () => {
    const { anchor, preloadCalls } = await setup();

    anchor.dispatchEvent(new Event('pointerenter'));
    anchor.dispatchEvent(new Event('pointerenter'));

    expect(preloadCalls.count).toBe(1);
  });

  it('triggers preload on focusin and resolves key from UrlTree', async () => {
    const urlSerializer = new DefaultUrlSerializer();
    const { preloadState, preloadCalls, anchor } = await setup({
      to: urlSerializer.parse('/feature/details'),
    });

    anchor.dispatchEvent(new Event('focusin'));

    expect(preloadCalls.count).toBe(1);
    expect(preloadState.canStartPreload('feature')).toBe(true);
  });

  it('passes query params and fragment when creating UrlTree', async () => {
    const { preloadCalls, preloadState, anchor } = await setup({
      to: ['home'],
      queryParams: { tab: 'overview' },
      fragment: 'intro',
    });

    anchor.dispatchEvent(new Event('pointerenter'));

    expect(preloadCalls.count).toBe(1);
    expect(preloadState.canStartPreload('home')).toBe(true);
  });
});
