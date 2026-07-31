import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  AtomicDropdownItem,
  AtomicDropdownModule,
} from '../../shared/components/atomic-dropdown/atomic-dropdown';
import { Placement, Side } from '../../shared/components/atomic-popover/atomic-popover-utils';

@Component({
  selector: 'app-dropdown-showcase',
  imports: [AtomicDropdownModule],
  templateUrl: './dropdown-showcase.html',
  styleUrl: './dropdown-showcase.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownShowcase {
  protected readonly lastAction = signal<string>('(nothing yet)');

  private readonly select = (value: unknown) => this.lastAction.set(`selected: ${value}`);

  protected readonly basicItems: AtomicDropdownItem[] = [
    { label: 'Profile', value: 'profile', onClick: this.select },
    { label: 'Settings', value: 'settings', onClick: this.select },
    { label: 'Billing', value: 'billing', onClick: this.select },
    { label: 'Sign out', value: 'sign-out', onClick: this.select },
  ];

  protected readonly disabledItems: AtomicDropdownItem[] = [
    { label: 'Duplicate', value: 'duplicate', onClick: this.select },
    { label: 'Rename', value: 'rename', onClick: this.select },
    { label: 'Archive', value: 'archive', disabled: true, onClick: this.select },
    { label: 'Delete', value: 'delete', disabled: true, onClick: this.select },
  ];

  // 沒有 onClick 的項目點擊後仍會關閉選單。
  protected readonly plainItems: AtomicDropdownItem[] = [
    { label: 'Just a label', value: 'plain-1' },
    { label: 'Also nothing to do', value: 'plain-2' },
  ];

  // onClick 的參數個數決定關閉行為:一個參數 → 元件自動 close();
  // 兩個參數 → 交給項目自己決定何時 close,不呼叫就保持開啟。
  protected readonly manualCloseItems: AtomicDropdownItem[] = [
    {
      label: 'Stays open',
      value: 'stay',
      // _close 沒有用到,但必須宣告 —— 元件是靠參數個數判斷由誰負責關閉。
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onClick: (value, _close) => this.lastAction.set(`${value} @ ${new Date().toISOString()}`),
    },
    {
      label: 'Acts then closes',
      value: 'act-close',
      onClick: (value, close) => {
        this.lastAction.set(`${value} @ ${new Date().toISOString()}`);
        close();
      },
    },
  ];

  protected readonly inboxItems: AtomicDropdownItem[] = [
    { label: 'Inbox', value: 'inbox', context: { badge: 12 }, onClick: this.select },
    { label: 'Drafts', value: 'drafts', context: { badge: 3 }, onClick: this.select },
    { label: 'Archived', value: 'archived', context: { badge: 0 }, disabled: true },
  ];

  protected readonly longItems: AtomicDropdownItem[] = Array.from({ length: 20 }, (_, i) => ({
    label: `Item ${i + 1}`,
    value: `item-${i + 1}`,
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
