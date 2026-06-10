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

export interface AtomicTabsContext {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedValue: Signal<any>;
}

export const ATOMIC_TABS = new InjectionToken<AtomicTabsContext>('ATOMIC_TABS');

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
      };
    });
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
