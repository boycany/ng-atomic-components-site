import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { OffsetObject, Placement, Side } from '../atomic-popover/atomic-popover-utils';
import { AtomicPopover } from '../atomic-popover/atomic-popover';
import { moveFocus, nextItem, previousItem } from '../../helpers/move-focus/move-focus.helper';

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
  offset = input<number | Partial<OffsetObject>>(0);
  trigger = input<'click' | 'hover'>('click');
  disabled = input<boolean>(false);

  itemsCompose = computed(() => {
    return this.items().map((item, index) => {
      const onClick = () => {
        if (item.disabled || !item.onClick) return;

        if (item.onClick.length <= 1) {
          item.onClick(item.value);
          this.close();
          return;
        }

        return item.onClick(item.value, this.close);
      };

      const onKeydown = (event: KeyboardEvent) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        onClick();
      };

      return {
        ...item,
        tabIndex: index === 0 ? 0 : -1,
        onClick,
        onKeydown,
      };
    });
  });

  menuEl = viewChild<ElementRef<HTMLUListElement>>('menu');

  close = () => this.active.set(false);

  onMenuKeydown(event: KeyboardEvent) {
    const container = this.menuEl()?.nativeElement;
    const currentFocus = document.activeElement as HTMLElement;

    if (!container) return;

    switch (event.key) {
      case 'Tab':
        event.preventDefault();
        this.close();
        break;
      case 'ArrowDown':
        event.preventDefault();
        moveFocus(container, currentFocus, nextItem);
        break;
      case 'ArrowUp':
        event.preventDefault();
        moveFocus(container, currentFocus, previousItem);
        break;
      case 'Home':
        event.preventDefault();
        moveFocus(container, null, nextItem);
        break;
      case 'End':
        event.preventDefault();
        moveFocus(container, null, previousItem);
        break;
    }
  }
}

export interface AtomicDropdownItem {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (value: any, close?: () => void) => void;
  disabled: boolean;
}
