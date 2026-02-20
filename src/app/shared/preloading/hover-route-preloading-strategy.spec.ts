import { TestBed } from '@angular/core/testing';
import { Route } from '@angular/router';
import { of } from 'rxjs';

import { HoverRoutePreloadState } from './hover-route-preload-state';
import { HoverRoutePreloadingStrategy } from './hover-route-preloading-strategy';

const setup = () => {
  TestBed.configureTestingModule({
    providers: [HoverRoutePreloadingStrategy, HoverRoutePreloadState],
  });

  const strategy = TestBed.inject(HoverRoutePreloadingStrategy);
  const state = TestBed.inject(HoverRoutePreloadState);

  return { strategy, state };
};

describe('HoverRoutePreloadingStrategy', () => {
  it('skips routes without hover preload metadata', () => {
    const { strategy } = setup();
    const route: Route = { path: 'home' };

    let loadCallCount = 0;
    strategy
      .preload(route, () => {
        loadCallCount += 1;
        return of(true);
      })
      .subscribe();

    expect(loadCallCount).toBe(0);
  });

  it('preloads only after state has requested the route key', () => {
    const { strategy, state } = setup();
    const route: Route = {
      path: 'home',
      data: {
        preloadOnHover: true,
        preloadKey: 'home',
      },
    };

    let loadCallCount = 0;

    strategy
      .preload(route, () => {
        loadCallCount += 1;
        return of(true);
      })
      .subscribe();

    expect(loadCallCount).toBe(0);

    state.requestPreload('home');

    strategy
      .preload(route, () => {
        loadCallCount += 1;
        return of(true);
      })
      .subscribe();

    expect(loadCallCount).toBe(1);
    expect(state.requestPreload('home')).toBe(false);
  });
});
