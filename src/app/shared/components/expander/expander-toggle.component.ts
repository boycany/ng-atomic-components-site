import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Expander } from './expander';

@Component({
  selector: 'app-expander-toggle',
  template: `
    @if (isExpanded()) {
      <ng-content select="[expander-open]" />
    } @else {
      <ng-content select="[expander-close]" />
    }
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpanderToggleComponent {
  readonly expanderComponent = inject(Expander, {
    optional: true,
  });
  readonly isExpanded = computed(() => this.expanderComponent?.isExpanded() === true);
  readonly isCollapsed = computed(() => this.expanderComponent?.isCollapsed() === true);
}
