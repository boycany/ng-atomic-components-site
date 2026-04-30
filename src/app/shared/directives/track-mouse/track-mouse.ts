import { Directive, ElementRef, inject, signal } from '@angular/core';
import { clamp } from '../../helpers/clamp.helper';

@Directive({
  selector: '[appTrackMouse]',
  host: {
    '(mousemove)': 'onMouseMove($event)',
    '[style.--mouse-x.px]': 'x()',
    '[style.--mouse-y.px]': 'y()',
  },
  exportAs: 'trackMouse',
})
export class TrackMouseDirective {
  readonly x = signal<number>(0);
  readonly y = signal<number>(0);
  readonly el = inject(ElementRef).nativeElement;

  onMouseMove(event: MouseEvent) {
    const rect = this.el.getBoundingClientRect();
    const x = clamp(0, event.clientX - rect.left, rect.width);
    const y = clamp(0, event.clientY - rect.top, rect.height);

    this.x.set(x);
    this.y.set(y);
  }
}
