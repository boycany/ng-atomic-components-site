import { Component, ElementRef, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DecorateDirective } from './decorate';
import { HighlightDirective } from '../highlight/highlight';
import { UnderlineDirective } from '../underline/underline';

@Component({
  imports: [DecorateDirective],
  template: `
    <span #defaultHost appDecorate>default</span>
    <span #colorHost appDecorate="pink">colored</span>
  `,
})
class HostComponent {
  readonly defaultHost = viewChild.required<ElementRef<HTMLElement>>('defaultHost');
  readonly colorHost = viewChild.required<ElementRef<HTMLElement>>('colorHost');
}

const setup = async () => {
  await TestBed.configureTestingModule({
    imports: [HostComponent],
  }).compileComponents();

  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();

  const component = fixture.componentInstance;
  return {
    fixture,
    component,
    defaultEl: component.defaultHost().nativeElement,
    colorEl: component.colorHost().nativeElement,
  };
};

describe('DecorateDirective', () => {
  it('should compose UnderlineDirective and HighlightDirective on the host', async () => {
    const { defaultEl } = await setup();

    expect(defaultEl.style.textDecoration).toBe('underline');
    expect(defaultEl.style.cursor).toBe('pointer');
    expect(defaultEl.getAttribute('tabIndex')).toBe('0');
  });

  it('should default the highlight background to lime when no color is provided', async () => {
    const { defaultEl } = await setup();
    expect(defaultEl.style.backgroundColor).toBe('lime');
  });

  it('should forward the appDecorate value to the highlight color input', async () => {
    const { colorEl } = await setup();
    expect(colorEl.style.backgroundColor).toBe('pink');
    expect(colorEl.style.textDecoration).toBe('underline');
  });

  it('should toggle the highlight active state when clicked', async () => {
    const { fixture, defaultEl } = await setup();

    defaultEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(defaultEl.style.backgroundColor).toBe('pink');
  });

  it('should declare UnderlineDirective and HighlightDirective as host directives', () => {
    const meta = (DecorateDirective as unknown as { ɵdir: { hostDirectives: unknown[] } }).ɵdir;
    const hostDirectives = meta.hostDirectives as { directive: unknown }[];
    const types = hostDirectives.map((entry) => entry.directive);

    expect(types).toContain(UnderlineDirective);
    expect(types).toContain(HighlightDirective);
  });
});
