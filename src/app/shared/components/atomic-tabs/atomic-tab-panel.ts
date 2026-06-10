import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ATOMIC_TABS } from './atomic-tabs';

@Component({
  selector: 'app-atomic-tab-panel',
  imports: [],
  template: `<div role="tabpanel" [hidden]="!selected()"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomicTabPanel {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value = input.required<any>();

  private tabs = inject(ATOMIC_TABS);

  // keep-alive:用 [hidden] 而非 @if,切走時 panel 內容不會被 destroy,狀態自然保留
  selected = computed(() => this.tabs.selectedValue() === this.value());
}
