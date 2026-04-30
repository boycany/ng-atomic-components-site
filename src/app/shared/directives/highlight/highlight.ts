import { computed, Directive, input, output, signal } from '@angular/core';
import { DateTime } from 'luxon';

@Directive({
  selector: '[appHighlight]',
  host: {
    '[attr.tabIndex]': '0',
    '[style.background-color]': 'bg()',
    '[style.cursor]': '"pointer"',
    '(click)': 'toggleActive()',
    '(keyup.shift.enter)': 'onKeyPressed($event)',
  },
  exportAs: 'highlightDir',
})
export class HighlightDirective {
  /* eslint-disable @angular-eslint/no-input-rename */
  readonly color = input('', { alias: 'highlight' });
  /* eslint-enable @angular-eslint/no-input-rename */
  readonly bg = computed(() => (this.isActive() ? 'pink' : this.color() || 'lime'));

  readonly isActive = signal(false);

  readonly activated = output<void>();
  readonly deactivated = output<number>();
  activationTime: DateTime | null = null;

  toggleActive() {
    this.isActive.set(!this.isActive());

    if (this.isActive()) {
      this.activated.emit();
      this.activationTime = DateTime.now();
    } else {
      if (!this.activationTime) {
        return;
      }
      const timeSince = DateTime.now().diff(this.activationTime).toMillis();
      this.activationTime = null;
      this.deactivated.emit(timeSince);
    }
  }

  onKeyPressed(ev: Event) {
    console.log('ev :>> ', ev);
  }
}
