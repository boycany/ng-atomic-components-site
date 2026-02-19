import { hasProtocol } from 'ufo';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Params, Router, RouterLink, UrlTree } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';

/** The AtomicLink component is used to create links that can be either internal or external. */
@Component({
  selector: 'app-atomic-link',
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './atomic-link.html',
  styleUrl: './atomic-link.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomicLink {
  private readonly router = inject(Router);

  // Router Link
  to = input<string | string[] | UrlTree | null | undefined>('');
  queryParams = input<Params | null | undefined>(undefined);
  fragment = input<string | undefined>(undefined);

  // external
  target = input<string | undefined>(undefined);
  external = input<boolean>(false);

  // text
  text = input<string | undefined>(undefined);
  linkLabel = computed(() => this.buildLinkLabel());

  externalHref = computed(() => {
    return this.resolveToValue(this.to());
  });

  // state
  isExternal = computed(() => {
    const to = this.to();
    const target = this.target();

    if (this.external()) {
      return true;
    }
    if (target && target !== '_self') {
      return true;
    }
    if (!to) {
      return true;
    }
    if (typeof to === 'object') {
      return false;
    }
    return hasProtocol(to, { acceptRelative: false });
  });

  private buildLinkLabel(): string {
    const baseLabel = this.text() ?? this.resolveToValue(this.to());

    return this.appendQueryAndFragment(baseLabel, this.queryParams(), this.fragment());
  }

  private resolveToValue(to: string | string[] | UrlTree | null | undefined): string {
    if (typeof to === 'string') {
      return to;
    }

    if (Array.isArray(to)) {
      return to.join('/');
    }

    if (to instanceof UrlTree) {
      return this.router.serializeUrl(to);
    }

    return '';
  }

  private appendQueryAndFragment(
    value: string,
    queryParams: Params | null | undefined,
    fragment: string | undefined
  ): string {
    let result = value;

    const queryString = this.toQueryString(queryParams);
    if (queryString) {
      result += `?${queryString}`;
    }

    if (fragment) {
      result += `#${fragment}`;
    }

    return result;
  }

  private toQueryString(queryParams: Params | null | undefined): string {
    if (!queryParams) {
      return '';
    }

    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(queryParams)) {
      if (value == null) {
        continue;
      }

      if (Array.isArray(value)) {
        for (const item of value) {
          if (item != null) {
            searchParams.append(key, String(item));
          }
        }
        continue;
      }

      searchParams.append(key, String(value));
    }

    return searchParams.toString();
  }
}
