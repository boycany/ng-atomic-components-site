import { Component, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NoPreloading, provideRouter, withPreloading } from '@angular/router';

import { AtomicBreadcrumb } from './atomic-breadcrumb';

@Component({
  template: '<span class="custom-separator">•</span>',
})
class TestSeparatorComponent {}

const setup = async () => {
  await TestBed.configureTestingModule({
    imports: [AtomicBreadcrumb, TestSeparatorComponent],
    providers: [provideRouter([], withPreloading(NoPreloading))],
  }).compileComponents();

  const fixture = TestBed.createComponent(AtomicBreadcrumb);
  const component = fixture.componentInstance;

  return { fixture, component };
};

describe('AtomicBreadcrumb', () => {
  it('should create', async () => {
    const { component } = await setup();

    expect(component).toBeTruthy();
  });

  it('throws when required items input is missing during first change detection', async () => {
    const { fixture } = await setup();

    expect(() => fixture.detectChanges()).toThrow();
  });

  it('renders text items with default string separator', async () => {
    const { fixture } = await setup();

    fixture.componentRef.setInput('items', [{ label: 'Home' }, { label: 'Design System' }]);
    fixture.detectChanges();

    const labels = Array.from(
      fixture.nativeElement.querySelectorAll('.atomic-breadcrumb__link') as NodeListOf<HTMLElement>
    ).map((el) => el.textContent?.trim());
    const separators = Array.from(
      fixture.nativeElement.querySelectorAll(
        '.atomic-breadcrumb__separator'
      ) as NodeListOf<HTMLElement>
    ).map((el) => el.textContent?.trim());

    expect(labels).toEqual(['Home', 'Design System']);
    expect(separators).toEqual(['/']);
  });

  it('renders atomic links for items with to', async () => {
    const { fixture } = await setup();

    fixture.componentRef.setInput('items', [
      { label: 'Home', to: '/' },
      { label: 'Components', to: '/components' },
      { label: 'Breadcrumb' },
    ]);
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
    const labels = Array.from(
      fixture.nativeElement.querySelectorAll('.atomic-breadcrumb__link') as NodeListOf<HTMLElement>
    ).map((el) => el.textContent?.trim());

    expect(links.length).toBe(2);
    expect(links[0]?.getAttribute('href')).toContain('/');
    expect(links[0]?.getAttribute('aria-label')).toBe('Home');
    expect(links[1]?.getAttribute('href')).toContain('/components');
    expect(links[1]?.getAttribute('aria-label')).toBe('Components');
    expect(labels).toContain('Breadcrumb');
  });

  it('uses custom string separator', async () => {
    const { fixture } = await setup();

    fixture.componentRef.setInput('items', [{ label: 'A' }, { label: 'B' }, { label: 'C' }]);
    fixture.componentRef.setInput('separator', '>');
    fixture.detectChanges();

    const separators = Array.from(
      fixture.nativeElement.querySelectorAll(
        '.atomic-breadcrumb__separator'
      ) as NodeListOf<HTMLElement>
    ).map((el) => el.textContent?.trim());

    expect(separators).toEqual(['>', '>']);
  });

  it('uses custom component separator when separator input is a component type', async () => {
    const { fixture } = await setup();
    const separatorComponent = TestSeparatorComponent as Type<unknown>;

    fixture.componentRef.setInput('items', [{ label: 'A' }, { label: 'B' }, { label: 'C' }]);
    fixture.componentRef.setInput('separator', separatorComponent);
    fixture.detectChanges();

    const customSeparators = fixture.nativeElement.querySelectorAll(
      '.custom-separator'
    ) as NodeListOf<HTMLElement>;

    expect(customSeparators.length).toBe(2);
  });

  it('sets aria-current="page" only on the last non-link item', async () => {
    const { fixture } = await setup();

    fixture.componentRef.setInput('items', [
      { label: 'Home' },
      { label: 'Category' },
      { label: 'Current Page' },
    ]);
    fixture.detectChanges();

    const spans = fixture.nativeElement.querySelectorAll(
      '.atomic-breadcrumb__link'
    ) as NodeListOf<HTMLElement>;

    expect(spans[0]?.getAttribute('aria-current')).toBeNull();
    expect(spans[1]?.getAttribute('aria-current')).toBeNull();
    expect(spans[2]?.getAttribute('aria-current')).toBe('page');
  });

  it('does not set aria-current when the last item is a link', async () => {
    const { fixture } = await setup();

    fixture.componentRef.setInput('items', [
      { label: 'Home', to: '/' },
      { label: 'About', to: '/about' },
    ]);
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
    expect(links[1]?.getAttribute('aria-current')).toBeNull();
  });

  it('does not apply sr-only class when iconTmpl is absent', async () => {
    const { fixture } = await setup();

    fixture.componentRef.setInput('items', [
      { label: 'Home', iconOnly: true },
      { label: 'Current' },
    ]);
    fixture.detectChanges();

    const labelSpans = fixture.nativeElement.querySelectorAll(
      '.atomic-breadcrumb__link'
    ) as NodeListOf<HTMLElement>;
    // iconOnly without iconTmpl should NOT apply sr-only
    labelSpans.forEach((span) => {
      expect(span.classList.contains('atomic-breadcrumb__label--sr-only')).toBe(false);
    });
  });
});
