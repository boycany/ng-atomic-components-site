import { Params, UrlTree } from '@angular/router';

export type LinkTo = string | string[] | UrlTree | null | undefined;

export function buildLinkLabel(args: {
  text: string | undefined;
  to: LinkTo;
  queryParams: Params | null | undefined;
  fragment: string | undefined;
  serializeUrl: (urlTree: UrlTree) => string;
}): string {
  const baseLabel = args.text ?? resolveToValue(args.to, args.serializeUrl);

  return appendQueryAndFragment(baseLabel, args.queryParams, args.fragment);
}

export function resolveToValue(to: LinkTo, serializeUrl: (urlTree: UrlTree) => string): string {
  if (typeof to === 'string') {
    return to;
  }

  if (Array.isArray(to)) {
    return to.join('/');
  }

  if (to instanceof UrlTree) {
    return serializeUrl(to);
  }

  return '';
}

export function isExternalLink(args: {
  to: LinkTo;
  target: string | undefined;
  external: boolean;
  hasProtocolFn: (value: string) => boolean;
}): boolean {
  if (args.external) {
    return true;
  }
  if (args.target && args.target !== '_self') {
    return true;
  }
  if (!args.to) {
    return true;
  }
  if (typeof args.to === 'object') {
    return false;
  }

  return args.hasProtocolFn(args.to);
}

export function appendQueryAndFragment(
  value: string,
  queryParams: Params | null | undefined,
  fragment: string | undefined
): string {
  let result = value;

  const queryString = toQueryString(queryParams);
  if (queryString) {
    result += `?${queryString}`;
  }

  if (fragment) {
    result += `#${fragment}`;
  }

  return result;
}

export function toQueryString(queryParams: Params | null | undefined): string {
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
