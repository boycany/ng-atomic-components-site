import { Directive, ElementRef, inject, signal } from '@angular/core';

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

  // constructor() {
  //   console.log('TrackMouseDirective initialized');
  // }

  onMouseMove(event: MouseEvent) {
    // console.log('this.el :>> ', this.el);
    const rect = this.el.getBoundingClientRect();
    // console.log('rect :>> ', rect);
    // console.log('event :>> ', event);
    const x = this.clamp(event.clientX - rect.left, 0, rect.width);
    const y = this.clamp(event.clientY - rect.top, 0, rect.height);

    this.x.set(x);
    this.y.set(y);

    // console.log(this.x(), this.y());
  }

  clamp(min: number, num: number, max: number) {
    return Math.min(Math.max(num, min), max);
  }
}
