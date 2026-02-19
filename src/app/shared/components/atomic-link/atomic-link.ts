import { hasProtocol } from 'ufo';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Params, Router, RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { buildLinkLabel, isExternalLink, LinkTo, resolveToValue } from './atomic-link.utils';

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
  to = input<LinkTo>('');
  queryParams = input<Params | null | undefined>(undefined);
  fragment = input<string | undefined>(undefined);

  // external
  target = input<string | undefined>(undefined);
  external = input<boolean>(false);

  // text
  text = input<string | undefined>(undefined);
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
}
