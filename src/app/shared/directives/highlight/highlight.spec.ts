import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DateTime } from 'luxon';

import { HighlightDirective } from './highlight';

@Component({
  imports: [HighlightDirective],
  template: `<span #host appHighlight [highlight]="color()">highlight me</span>`,
})
class HostComponent {
  readonly color = signal('');
  readonly host = viewChild.required<ElementRef<HTMLElement>>('host');
  readonly directive = viewChild.required(HighlightDirective);
}

const setup = async () => {
  await TestBed.configureTestingModule({
    imports: [HostComponent],
  }).compileComponents();

  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  await fixture.whenStable();

  const component = fixture.componentInstance;
  return {
    fixture,
    component,
    hostEl: component.host().nativeElement,
    directive: component.directive(),
  };
};

describe('HighlightDirective', () => {
  it('should create with default state', async () => {
    const { directive } = await setup();
    expect(directive).toBeTruthy();
    expect(directive.isActive()).toBe(false);
    expect(directive.color()).toBe('');
    expect(directive.activationTime).toBeNull();
  });

  describe('bg computed', () => {
    it('should default to lime when no color is provided and not active', async () => {
      const { directive } = await setup();
      expect(directive.bg()).toBe('lime');
    });

    it('should use the provided color when not active', async () => {
      const { fixture, component, directive } = await setup();
      component.color.set('yellow');
      await fixture.whenStable();
      fixture.detectChanges();

      expect(directive.bg()).toBe('yellow');
    });

    it('should use pink when active regardless of color input', async () => {
      const { fixture, component, directive } = await setup();
      component.color.set('yellow');
      await fixture.whenStable();
      fixture.detectChanges();

      directive.isActive.set(true);
      expect(directive.bg()).toBe('pink');
    });
  });

  describe('host bindings', () => {
    it('should set tabindex, cursor and background-color on the host', async () => {
      const { fixture, hostEl } = await setup();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(hostEl.getAttribute('tabIndex')).toBe('0');
      expect(hostEl.style.cursor).toBe('pointer');
      expect(hostEl.style.backgroundColor).toBe('lime');
    });

    it('should reflect bg() into background-color when toggled', async () => {
      const { fixture, hostEl } = await setup();

      hostEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await fixture.whenStable();
      fixture.detectChanges();

      expect(hostEl.style.backgroundColor).toBe('pink');
    });
  });

  describe('toggleActive', () => {
    it('should activate on first call and emit activated', async () => {
      const { directive } = await setup();
      const activatedSpy = vi.fn();
      directive.activated.subscribe(activatedSpy);

      directive.toggleActive();

      expect(directive.isActive()).toBe(true);
      expect(activatedSpy).toHaveBeenCalledTimes(1);
      expect(directive.activationTime).not.toBeNull();
    });

    it('should deactivate on second call and emit deactivated with elapsed millis', async () => {
      const { directive } = await setup();
      const deactivatedSpy = vi.fn();
      directive.deactivated.subscribe(deactivatedSpy);

      const start = DateTime.fromISO('2026-04-30T10:00:00.000Z') as DateTime<true>;
      const end = start.plus({ milliseconds: 1500 }) as DateTime<true>;
      const nowSpy = vi.spyOn(DateTime, 'now').mockReturnValueOnce(start).mockReturnValueOnce(end);

      directive.toggleActive();
      directive.toggleActive();

      expect(directive.isActive()).toBe(false);
      expect(deactivatedSpy).toHaveBeenCalledTimes(1);
      expect(deactivatedSpy).toHaveBeenCalledWith(1500);
      expect(directive.activationTime).toBeNull();

      nowSpy.mockRestore();
    });

    it('should not emit deactivated when no prior activation time exists', async () => {
      const { directive } = await setup();
      const deactivatedSpy = vi.fn();
      directive.deactivated.subscribe(deactivatedSpy);

      directive.isActive.set(true);
      directive.toggleActive();

      expect(directive.isActive()).toBe(false);
      expect(deactivatedSpy).not.toHaveBeenCalled();
    });
  });

  describe('click event', () => {
    it('should toggle isActive when host is clicked', async () => {
      const { fixture, hostEl, directive } = await setup();

      hostEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await fixture.whenStable();
      expect(directive.isActive()).toBe(true);

      hostEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await fixture.whenStable();
      expect(directive.isActive()).toBe(false);
    });
  });

  describe('onKeyPressed', () => {
    it('should be invoked by shift+enter keyup on the host', async () => {
      const { fixture, hostEl, directive } = await setup();
      const spy = vi.spyOn(directive, 'onKeyPressed');

      hostEl.dispatchEvent(
        new KeyboardEvent('keyup', { key: 'Enter', shiftKey: true, bubbles: true })
      );
      await fixture.whenStable();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toBeInstanceOf(KeyboardEvent);
    });

    it('should not be invoked by plain enter keyup', async () => {
      const { fixture, hostEl, directive } = await setup();
      const spy = vi.spyOn(directive, 'onKeyPressed');

      hostEl.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
      await fixture.whenStable();

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
