import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  Signal,
  computed,
  forwardRef,
  input,
  model,
} from '@angular/core';
import { firstValueFrom, isObservable, Observable, of } from 'rxjs';
import { moveFocus, nextItem, previousItem } from '../../helpers/move-focus/move-focus.helper';

export interface AtomicTabsContext {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedValue: Signal<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lookup: Signal<Map<any, { tabId: string; tabpanelId: string }>>;
}

export const ATOMIC_TABS = new InjectionToken<AtomicTabsContext>('ATOMIC_TABS');

let nextUniqueId = 0;

@Component({
  selector: 'app-atomic-tabs',
  imports: [],
  templateUrl: './atomic-tabs.html',
  styleUrl: './atomic-tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ATOMIC_TABS,
      useExisting: forwardRef(() => AtomicTabs),
    },
  ],
})
export class AtomicTabs implements AtomicTabsContext {
  private readonly uid = `atomic-tabs-${nextUniqueId++}`;

  ariaLabel = input<string>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedValue = model.required<any>();
  items = input.required<AtomicTabsItem[]>();
  disabled = input<boolean>(false);

  tabs = computed(() => {
    return this.items().map((item) => {
      const disabled = this.disabled() || item.disabled || false;
      const selected = this.selectedValue() === item.value;
      return {
        ...item,
        disabled,
        selected,
        class: {
          'atomic-tabs__tab--selected': selected,
        },
        tabId: `${this.uid}-tab-${item.value}`,
        tabPanelId: `${this.uid}-panel-${item.value}`,
      };
    });
  });

  lookup = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const map = new Map<any, { tabId: string; tabpanelId: string }>();
    this.tabs().forEach((tab) => {
      map.set(tab.value, { tabId: tab.tabId, tabpanelId: tab.tabPanelId });
    });
    return map;
  });

  beforeChange = input<(e: AtomicTabsChange) => boolean | Promise<boolean> | Observable<boolean>>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async onTabClick(value: any) {
    const from = this.selectedValue();
    if (from === value) return;

    const guard = this.beforeChange();
    if (guard) {
      const result = guard({ from, to: value });
      const allowed = await firstValueFrom(isObservable(result) ? result : of(result));
      if (!allowed) return;
    }
    this.selectedValue.set(value);
  }

  onTabKeydown(event: KeyboardEvent) {
    const tablist = event.currentTarget as HTMLElement;
    // console.log('tablist: ', tablist);
    const currentFocus = document.activeElement as HTMLElement;
    // console.log('currentFocus: ', currentFocus);

    if (!tablist) return;
    // console.log('event.key', event.key);
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        moveFocus(tablist, currentFocus, nextItem);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        moveFocus(tablist, currentFocus, previousItem);
        break;
      case 'Home':
        event.preventDefault();
        moveFocus(tablist, null, nextItem);
        break;
      case 'End':
        event.preventDefault();
        moveFocus(tablist, null, previousItem);
        break;
    }
  }
}

export interface AtomicTabsItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  label: string;
  disabled?: boolean;
}

export interface AtomicTabsChange {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  from: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  to: any;
}
