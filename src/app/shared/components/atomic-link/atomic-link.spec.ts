import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AtomicLink } from './atomic-link';

const setup = async () => {
  await TestBed.configureTestingModule({
    imports: [AtomicLink],
    providers: [provideRouter([])],
  }).compileComponents();

  const fixture = TestBed.createComponent(AtomicLink);
  const component = fixture.componentInstance;
  const router = TestBed.inject(Router);

  return { fixture, component, router };
};

describe('AtomicLink', () => {
  it('should create', async () => {
    const { component } = await setup();

    expect(component).toBeTruthy();
  });

  it('renders internal router link for relative path', async () => {
    const { fixture } = await setup();

    fixture.componentRef.setInput('to', '/products');
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toContain('/products');
    expect(link.getAttribute('rel')).toBeNull();
    expect(link.textContent?.trim()).toBe('/products');
  });

  it('renders external link for absolute URL', async () => {
    const { fixture } = await setup();

    fixture.componentRef.setInput('to', 'https://angular.dev');
    fixture.componentRef.setInput('target', '_blank');
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('https://angular.dev');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.getAttribute('target')).toBe('_blank');
  });

  it('treats mailto protocol as external link', async () => {
    const { fixture } = await setup();

    fixture.componentRef.setInput('to', 'mailto:test@example.com');
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.getAttribute('href')).toBe('mailto:test@example.com');
  });

  it('treats tel protocol as external link', async () => {
    const { fixture } = await setup();

    fixture.componentRef.setInput('to', 'tel:+886912345678');
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.getAttribute('href')).toBe('tel:+886912345678');
  });

  it('treats null to as external and renders empty href fallback', async () => {
    const { fixture } = await setup();

    fixture.componentRef.setInput('to', null);
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.getAttribute('href')).toBe('');
    expect(link.textContent?.trim()).toBe('');
  });

  it('forces external link when external input is true', async () => {
    const { fixture } = await setup();

    fixture.componentRef.setInput('to', '/internal');
    fixture.componentRef.setInput('external', true);
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.getAttribute('href')).toContain('/internal');
  });

  it('keeps UrlTree as internal by default', async () => {
    const { fixture, router } = await setup();
    const urlTree = router.createUrlTree(['/dashboard']);

    fixture.componentRef.setInput('to', urlTree);
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('rel')).toBeNull();
    expect(link.getAttribute('href')).toContain('/dashboard');
  });

  it('serializes UrlTree when forced to external', async () => {
    const { fixture, router } = await setup();
    const urlTree = router.createUrlTree(['/reports']);

    fixture.componentRef.setInput('to', urlTree);
    fixture.componentRef.setInput('external', true);
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toContain('/reports');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('joins array to value with slash separators', async () => {
    const { fixture } = await setup();

    fixture.componentRef.setInput('to', ['docs', 'api']);
    fixture.componentRef.setInput('external', true);
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('docs/api');
    expect(link.textContent?.trim()).toBe('docs/api');
  });

  it('appends query params and fragment to computed label', async () => {
    const { fixture } = await setup();

    fixture.componentRef.setInput('to', '/docs');
    fixture.componentRef.setInput('queryParams', { page: '2', sort: 'name' });
    fixture.componentRef.setInput('fragment', 'overview');
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent?.trim();
    expect(text).toContain('/docs?page=2&sort=name#overview');
  });

  it('serializes mixed query param types and skips null values', async () => {
    const { fixture } = await setup();

    fixture.componentRef.setInput('to', '/search');
    fixture.componentRef.setInput('queryParams', {
      page: 2,
      featured: false,
      tags: ['angular', 'signals'],
      empty: null,
    });
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent?.trim();
    expect(text).toContain('/search?');
    expect(text).toContain('page=2');
    expect(text).toContain('featured=false');
    expect(text).toContain('tags=angular');
    expect(text).toContain('tags=signals');
    expect(text).not.toContain('empty=');
  });

  it('skips null and undefined values inside query param arrays', async () => {
    const { fixture } = await setup();

    fixture.componentRef.setInput('to', '/search');
    fixture.componentRef.setInput('queryParams', {
      tags: ['angular', null, undefined, 'signals'],
    });
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent?.trim();
    expect(text).toContain('/search?');
    expect(text).toContain('tags=angular');
    expect(text).toContain('tags=signals');
    expect(text).not.toContain('null');
    expect(text).not.toContain('undefined');
  });

  it('does not append hash when fragment is an empty string', async () => {
    const { fixture } = await setup();

    fixture.componentRef.setInput('to', '/guide');
    fixture.componentRef.setInput('fragment', '');
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent?.trim();
    expect(text).toBe('/guide');
    expect(text).not.toContain('#');
  });

  it('appends fragment without question mark when query params is empty', async () => {
    const { fixture } = await setup();

    fixture.componentRef.setInput('to', '/guide');
    fixture.componentRef.setInput('queryParams', {});
    fixture.componentRef.setInput('fragment', 'install');
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent?.trim();
    expect(text).toBe('/guide#install');
    expect(text).not.toContain('?');
  });

  it('does not append question mark when query params is an empty object', async () => {
    const { fixture } = await setup();

    fixture.componentRef.setInput('to', '/guide');
    fixture.componentRef.setInput('queryParams', {});
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent?.trim();
    expect(text).toBe('/guide');
    expect(text).not.toContain('?');
  });

  it('prefers text input over url as link label', async () => {
    const { fixture } = await setup();

    fixture.componentRef.setInput('to', '/docs');
    fixture.componentRef.setInput('text', 'Read docs');
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(link.textContent?.trim()).toBe('Read docs');
  });

  it('treats non-self target as external', async () => {
    const { fixture } = await setup();

    fixture.componentRef.setInput('to', '/local-path');
    fixture.componentRef.setInput('target', '_blank');
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.getAttribute('target')).toBe('_blank');
  });

  it('keeps internal link when target is _self', async () => {
    const { fixture } = await setup();

    fixture.componentRef.setInput('to', '/local-path');
    fixture.componentRef.setInput('target', '_self');
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('rel')).toBeNull();
    expect(link.getAttribute('target')).toBeNull();
    expect(link.getAttribute('href')).toContain('/local-path');
  });

  it('recomputes linkLabel and externalHref after multiple input updates', async () => {
    const { fixture, component, router } = await setup();

    fixture.componentRef.setInput('to', '/docs');
    fixture.detectChanges();
    expect(component.linkLabel()).toBe('/docs');
    expect(component.externalHref()).toBe('/docs');

    fixture.componentRef.setInput('text', 'Docs Link');
    fixture.componentRef.setInput('queryParams', { page: 1 });
    fixture.componentRef.setInput('fragment', 'intro');
    fixture.detectChanges();
    expect(component.linkLabel()).toBe('Docs Link?page=1#intro');

    fixture.componentRef.setInput('text', undefined);
    fixture.componentRef.setInput('to', ['guide', 'signals']);
    fixture.componentRef.setInput('queryParams', undefined);
    fixture.componentRef.setInput('fragment', undefined);
    fixture.detectChanges();
    expect(component.linkLabel()).toBe('guide/signals');
    expect(component.externalHref()).toBe('guide/signals');

    const urlTree = router.createUrlTree(['/dashboard']);
    fixture.componentRef.setInput('to', urlTree);
    fixture.detectChanges();
    expect(component.linkLabel()).toContain('/dashboard');
    expect(component.externalHref()).toContain('/dashboard');

    fixture.componentRef.setInput('to', null);
    fixture.detectChanges();
    expect(component.externalHref()).toBe('');
  });

  it('recomputes isExternal across sequential state transitions', async () => {
    const { fixture, component } = await setup();

    fixture.componentRef.setInput('to', '/internal');
    fixture.detectChanges();
    expect(component.isExternal()).toBe(false);

    fixture.componentRef.setInput('target', '_blank');
    fixture.detectChanges();
    expect(component.isExternal()).toBe(true);

    fixture.componentRef.setInput('target', '_self');
    fixture.detectChanges();
    expect(component.isExternal()).toBe(false);

    fixture.componentRef.setInput('external', true);
    fixture.detectChanges();
    expect(component.isExternal()).toBe(true);

    fixture.componentRef.setInput('external', false);
    fixture.componentRef.setInput('to', 'mailto:test@example.com');
    fixture.detectChanges();
    expect(component.isExternal()).toBe(true);

    fixture.componentRef.setInput('to', null);
    fixture.detectChanges();
    expect(component.isExternal()).toBe(true);
  });
});
