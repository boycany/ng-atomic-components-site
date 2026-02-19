import { DefaultUrlSerializer, UrlTree } from '@angular/router';

import {
  appendQueryAndFragment,
  buildLinkLabel,
  isExternalLink,
  resolveToValue,
  toQueryString,
} from './atomic-link.utils';

describe('AtomicLink logic helpers', () => {
  it('resolveToValue should support string, array, UrlTree, and null', () => {
    const serializer = new DefaultUrlSerializer();
    const serializeUrl = (urlTree: UrlTree) => serializer.serialize(urlTree);

    expect(resolveToValue('/docs', serializeUrl)).toBe('/docs');
    expect(resolveToValue(['guide', 'signals'], serializeUrl)).toBe('guide/signals');
    expect(resolveToValue(serializer.parse('/dashboard'), serializeUrl)).toBe('/dashboard');
    expect(resolveToValue(null, serializeUrl)).toBe('');
  });

  it('toQueryString should skip nullish values and nullish array entries', () => {
    const queryString = toQueryString({
      page: 2,
      tags: ['angular', null, undefined, 'signals'],
      empty: null,
    });

    expect(queryString).toContain('page=2');
    expect(queryString).toContain('tags=angular');
    expect(queryString).toContain('tags=signals');
    expect(queryString).not.toContain('empty=');
    expect(queryString).not.toContain('null');
    expect(queryString).not.toContain('undefined');
  });

  it('appendQueryAndFragment should append fragment without question mark when query is empty or nullish', () => {
    expect(appendQueryAndFragment('/guide', {}, 'install')).toBe('/guide#install');
    expect(appendQueryAndFragment('/guide', null, 'install')).toBe('/guide#install');
    expect(appendQueryAndFragment('/guide', undefined, 'install')).toBe('/guide#install');
  });

  it('buildLinkLabel should prefer text over to and append query and fragment', () => {
    const serializer = new DefaultUrlSerializer();

    const label = buildLinkLabel({
      text: 'Docs Link',
      to: '/docs',
      queryParams: { page: 1 },
      fragment: 'intro',
      serializeUrl: (urlTree) => serializer.serialize(urlTree),
    });

    expect(label).toBe('Docs Link?page=1#intro');
  });

  it('isExternalLink should classify internal and external values correctly', () => {
    const hasProtocolFn = (value: string) => /^(https?:|mailto:|tel:)/.test(value);

    expect(
      isExternalLink({
        to: '/internal',
        target: '_self',
        external: false,
        hasProtocolFn,
      })
    ).toBe(false);

    expect(
      isExternalLink({
        to: 'mailto:test@example.com',
        target: undefined,
        external: false,
        hasProtocolFn,
      })
    ).toBe(true);

    expect(
      isExternalLink({
        to: null,
        target: undefined,
        external: false,
        hasProtocolFn,
      })
    ).toBe(true);
  });
});
