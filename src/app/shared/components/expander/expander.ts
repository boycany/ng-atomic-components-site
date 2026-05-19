import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ExpanderToggle } from './expander-toggle';
import { ExpanderToggleComponent } from './expander-toggle.component';
import { AtomicButton } from '../atomic-button/atomic-button';

@Component({
  selector: 'app-expander',
  imports: [MatIconModule, AtomicButton],
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
  readonly expanderToggleDirective = contentChild(ExpanderToggle);
  readonly expanderToggleComponent = contentChild(ExpanderToggleComponent);
  readonly hasCustomToggle = computed(
    () => !!this.expanderToggleComponent() || !!this.expanderToggleDirective()
  );

  toggle() {
    this.#isExpanded.update((val) => !val);
  }
}
