import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { OffsetObject, Placement, Side } from '../atomic-popover/atomic-popover-utils';
import { AtomicPopover } from '../atomic-popover/atomic-popover';

@Component({
  selector: 'app-atomic-dropdown',
  imports: [AtomicPopover],
  templateUrl: './atomic-dropdown.html',
  styleUrl: './atomic-dropdown.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomicDropdown {
  active = signal<boolean>(false);

  items = input<AtomicDropdownItem[]>([]);
  placement = input<Side | Placement>('bottom-start');
  offset = input<number | Partial<OffsetObject>>(8);
  trigger = input<'click' | 'hover'>('click');
  disabled = input<boolean>(false);

  itemsCompose = computed(() => {
    return this.items().map((item) => {
      const onClick = () => {
        if (item.disabled || !item.onClick) return;

        if (item.onClick.length <= 1) {
          item.onClick(item.value);
          this.close();
          return;
        }

        return item.onClick(item.value, this.close);
      };
      return {
        ...item,
        onClick,
      };
    });
  });

  close = () => this.active.set(false);
}

export interface AtomicDropdownItem {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (value: any, close?: () => void) => void;
  disabled: boolean;
}
