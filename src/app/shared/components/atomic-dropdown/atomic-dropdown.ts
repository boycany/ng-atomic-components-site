import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { OffsetObject, Placement, Side } from '../atomic-popover/atomic-popover-utils';
import { AtomicPopover } from '../atomic-popover/atomic-popover';
import { moveFocus, nextItem, previousItem } from '../../helpers/move-focus/move-focus.helper';
import { MenuitemTemplateDirective } from './menuitem-template.directive';

@Component({
  selector: 'app-atomic-dropdown',
  imports: [AtomicPopover, NgTemplateOutlet],
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

  menuEl = viewChild<ElementRef<HTMLUListElement>>('menu');

  readonly menuitemTemplateDirective = contentChild(MenuitemTemplateDirective);
  readonly hasMenuitemTemplate = computed(() => !!this.menuitemTemplateDirective());
  readonly menuitemTemplate = computed(() => this.menuitemTemplateDirective()?.template ?? null);

  itemsCompose = computed(() => {
    const dropdownDisabled = this.disabled();

    return this.items().map((item, index) => {
      const disabled = dropdownDisabled || item.disabled || false;

      const onClick = () => {
        if (disabled) return;

        // 沒有 onClick 的項目仍要關閉選單,否則點下去像是卡住了。
        if (typeof item.onClick !== 'function') {
          this.close();
          return;
        }

        // 只宣告一個參數 = 開發者不打算自己控制關閉,由元件代勞;
        // 宣告到第二個參數 = 開發者要自己決定何時呼叫 close。
        if (item.onClick.length <= 1) {
          item.onClick(item.value, noop);
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
        disabled,
        tabIndex: index === 0 ? 0 : -1,
        onClick,
        onKeydown,
      };
    });
  });

  constructor() {
    // 選單展開時把焦點移進 <ul>。onMenuKeydown 綁在 <ul> 上靠事件冒泡,
    // 而觸發元素跟 <ul> 是兄弟子樹 —— 不主動移動焦點的話,鍵盤使用者
    // 打得開選單卻永遠進不去。
    //
    // 這裡不能用 menuEl() 當觸發來源:投影內容會隨宣告端的 view 一起提前建立,
    // menuEl() 從初始化就有值且不再變動,只有 active() 真正反映掛載與否。
    // 也不能用一般的 effect —— 它在 DOM 掛上去之前就跑了,對脫離文件的
    // 元素呼叫 focus() 沒有作用。
    afterRenderEffect(() => {
      if (!this.active()) return;
      this.menuEl()?.nativeElement.focus();
    });
  }

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

// close 在型別上是必填參數,所以 onClick 只宣告一個參數時仍得補上一個引數。
const noop = () => undefined;

export interface AtomicDropdownItem {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  // close 宣告成必填參數,是因為 onClick.length 要靠它來區分兩種使用方式。
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (value: any, close: () => void) => void;
  disabled?: boolean;
  // 給 menuitem slot 使用的自訂資料,元件本身不解讀。
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: any;
}

export const AtomicDropdownModule = [AtomicDropdown, MenuitemTemplateDirective];
