import { Component, ElementRef, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TrackMouseDirective } from './track-mouse';

@Component({
  imports: [TrackMouseDirective],
  template: `
    <div #host appTrackMouse #tracker="trackMouse">
      <span class="ball" [style.left.px]="tracker.x()" [style.top.px]="tracker.y()"></span>
    </div>
  `,
})
class HostComponent {
  readonly host = viewChild.required<ElementRef<HTMLElement>>('host');
  readonly tracker = viewChild.required(TrackMouseDirective);
}

const HOST_RECT = {
  left: 50,
  top: 100,
  right: 250,
  bottom: 300,
  width: 200,
  height: 200,
  x: 50,
  y: 100,
  toJSON: () => ({}),
} satisfies DOMRect;

const setup = async () => {
  await TestBed.configureTestingModule({
    imports: [HostComponent],
  }).compileComponents();

  const fixture = TestBed.createComponent(HostComponent);
  await fixture.whenStable();

  const component = fixture.componentInstance;
  const hostEl = component.host().nativeElement;
  const directive = component.tracker();

  vi.spyOn(hostEl, 'getBoundingClientRect').mockReturnValue(HOST_RECT);

  const dispatchMouseMove = (clientX: number, clientY: number) => {
    hostEl.dispatchEvent(new MouseEvent('mousemove', { clientX, clientY, bubbles: true }));
  };

  return { fixture, component, hostEl, directive, dispatchMouseMove };
};

describe('TrackMouseDirective', () => {
  it('should create with x and y signals initialized to 0', async () => {
    const { directive } = await setup();
    expect(directive).toBeTruthy();
    expect(directive.x()).toBe(0);
    expect(directive.y()).toBe(0);
  });

  it('should expose the host native element via el', async () => {
    const { directive, hostEl } = await setup();
    expect(directive.el).toBe(hostEl);
  });

  describe('onMouseMove', () => {
    it('should update x and y relative to the host bounding rect', async () => {
      const { directive, dispatchMouseMove } = await setup();

      dispatchMouseMove(120, 180);

      expect(directive.x()).toBe(70);
      expect(directive.y()).toBe(80);
    });

    it('should clamp x and y to 0 when the pointer is above/left of the host', async () => {
      const { directive, dispatchMouseMove } = await setup();

      dispatchMouseMove(0, 0);

      expect(directive.x()).toBe(0);
      expect(directive.y()).toBe(0);
    });

    it('should clamp x and y to host width/height when the pointer is past the host', async () => {
      const { directive, dispatchMouseMove } = await setup();

      dispatchMouseMove(9999, 9999);

      expect(directive.x()).toBe(HOST_RECT.width);
      expect(directive.y()).toBe(HOST_RECT.height);
    });

    it('should track multiple movements', async () => {
      const { directive, dispatchMouseMove } = await setup();

      dispatchMouseMove(60, 110);
      expect(directive.x()).toBe(10);
      expect(directive.y()).toBe(10);

      dispatchMouseMove(200, 250);
      expect(directive.x()).toBe(150);
      expect(directive.y()).toBe(150);
    });
  });

  describe('host style bindings', () => {
    it('should reflect signal values into --mouse-x and --mouse-y CSS variables', async () => {
      const { fixture, hostEl, dispatchMouseMove } = await setup();

      dispatchMouseMove(150, 200);
      await fixture.whenStable();
      fixture.detectChanges();

      expect(hostEl.style.getPropertyValue('--mouse-x')).toBe('100px');
      expect(hostEl.style.getPropertyValue('--mouse-y')).toBe('100px');
    });
  });
});
