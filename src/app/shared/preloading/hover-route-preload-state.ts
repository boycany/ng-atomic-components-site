import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HoverRoutePreloadState {
  private readonly requestedKeys = signal(new Set<string>());
  private readonly loadingKeys = signal(new Set<string>());
  private readonly loadedKeys = signal(new Set<string>());

  requestPreload(key: string): boolean {
    if (
      this.loadedKeys().has(key) ||
      this.loadingKeys().has(key) ||
      this.requestedKeys().has(key)
    ) {
      return false;
    }

    this.requestedKeys.update((existingKeys) => {
      const nextKeys = new Set(existingKeys);
      nextKeys.add(key);
      return nextKeys;
    });

    return true;
  }

  canStartPreload(key: string): boolean {
    return (
      this.requestedKeys().has(key) && !this.loadingKeys().has(key) && !this.loadedKeys().has(key)
    );
  }

  markLoading(key: string): void {
    this.loadingKeys.update((existingKeys) => {
      const nextKeys = new Set(existingKeys);
      nextKeys.add(key);
      return nextKeys;
    });
  }

  markLoaded(key: string): void {
    this.loadingKeys.update((existingKeys) => {
      const nextLoadingKeys = new Set(existingKeys);
      nextLoadingKeys.delete(key);
      return nextLoadingKeys;
    });

    this.requestedKeys.update((existingKeys) => {
      const nextRequestedKeys = new Set(existingKeys);
      nextRequestedKeys.delete(key);
      return nextRequestedKeys;
    });

    this.loadedKeys.update((existingKeys) => {
      const nextLoadedKeys = new Set(existingKeys);
      nextLoadedKeys.add(key);
      return nextLoadedKeys;
    });
  }
}
