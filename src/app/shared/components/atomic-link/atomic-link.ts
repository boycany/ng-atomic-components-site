import { hasProtocol } from 'ufo';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Params, Router, RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { buildLinkLabel, isExternalLink, LinkTo, resolveToValue } from './atomic-link.utils';
import { HoverRoutePreloadDirective } from '../../directives/hover-route-preload/hover-route-preload';

/** The AtomicLink component is used to create links that can be either internal or external. */
@Component({
  selector: 'app-atomic-link',
  imports: [RouterLink, NgTemplateOutlet, HoverRoutePreloadDirective],
  templateUrl: './atomic-link.html',
  styleUrl: './atomic-link.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomicLink {
  private readonly router = inject(Router);

  // Router Link
  to = input<LinkTo>('');
  queryParams = input<Params | null | undefined>(undefined);
  fragment = input<string | undefined>(undefined);

  // external
  target = input<string | undefined>(undefined);
  external = input<boolean>(false);

  // text
  text = input<string | undefined>(undefined);
  ariaLabel = input<string | undefined>(undefined);
  ariaDisabled = input<boolean>(false);
  tabIndex = input<number | undefined>(undefined);
  linkLabel = computed(() =>
    buildLinkLabel({
      text: this.text(),
      to: this.to(),
      queryParams: this.queryParams(),
      fragment: this.fragment(),
      serializeUrl: (urlTree) => this.router.serializeUrl(urlTree),
    })
  );

  externalHref = computed(() =>
    resolveToValue(this.to(), (urlTree) => this.router.serializeUrl(urlTree))
  );

  // state
  isExternal = computed(() =>
    isExternalLink({
      to: this.to(),
      target: this.target(),
      external: this.external(),
      hasProtocolFn: (value) => hasProtocol(value, { acceptRelative: false }),
    })
  );

  protected onAnchorClick(event: MouseEvent): void {
    if (!this.ariaDisabled()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  }
}
