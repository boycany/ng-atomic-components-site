import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  AtomicDropdown,
  AtomicDropdownItem,
} from '../../shared/components/atomic-dropdown/atomic-dropdown';
import { Placement, Side } from '../../shared/components/atomic-popover/atomic-popover-utils';

@Component({
  selector: 'app-dropdown-showcase',
  imports: [AtomicDropdown],
  templateUrl: './dropdown-showcase.html',
  styleUrl: './dropdown-showcase.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownShowcase {
  protected readonly lastAction = signal<string>('(nothing yet)');

  private readonly select = (value: unknown) => this.lastAction.set(`selected: ${value}`);

  protected readonly basicItems: AtomicDropdownItem[] = [
    { label: 'Profile', value: 'profile', disabled: false, onClick: this.select },
    { label: 'Settings', value: 'settings', disabled: false, onClick: this.select },
    { label: 'Billing', value: 'billing', disabled: false, onClick: this.select },
    { label: 'Sign out', value: 'sign-out', disabled: false, onClick: this.select },
  ];

  protected readonly disabledItems: AtomicDropdownItem[] = [
    { label: 'Duplicate', value: 'duplicate', disabled: false, onClick: this.select },
    { label: 'Rename', value: 'rename', disabled: false, onClick: this.select },
    { label: 'Archive (disabled)', value: 'archive', disabled: true, onClick: this.select },
    { label: 'Delete (disabled)', value: 'delete', disabled: true, onClick: this.select },
  ];

  // onClick 的 arity 決定關閉行為:1 個參數 → 元件自動 close();
  // 2 個參數 → 交給 item 自己決定何時 close,不傳就保持開啟。
  protected readonly manualCloseItems: AtomicDropdownItem[] = [
    {
      label: 'Increment (stays open)',
      value: 'increment',
      disabled: false,
      onClick: (value) => this.lastAction.set(`${value} @ ${new Date().toISOString()}`),
    },
    {
      label: 'Increment then close',
      value: 'increment-close',
      disabled: false,
      onClick: (value, close) => {
        this.lastAction.set(`${value} @ ${new Date().toISOString()}`);
        close?.();
      },
    },
  ];

  protected readonly longItems: AtomicDropdownItem[] = Array.from({ length: 20 }, (_, i) => ({
    label: `Item ${i + 1}`,
    value: `item-${i + 1}`,
    disabled: false,
    onClick: this.select,
  }));

  protected readonly placements: (Side | Placement)[] = [
    'bottom-start',
    'bottom-end',
    'top-start',
    'top-end',
    'right-start',
    'left-start',
  ];
}
