import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { AtomicButton } from '../atomic-button/atomic-button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-expander',
  imports: [AtomicButton, MatIconModule],
  templateUrl: './expander.html',
  styleUrl: './expander.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.collapsed]': 'isCollapsed()',
    '[class.expanded]': 'isExpanded()',
  },
})
export class Expander {
  readonly #isExpanded = signal(false); // add '#' to set as private
  readonly isExpanded = this.#isExpanded.asReadonly();
  readonly isCollapsed = computed(() => !this.isExpanded());

  readonly header = input('');

  toggle() {
    this.#isExpanded.update((val) => !val);
  }
}
