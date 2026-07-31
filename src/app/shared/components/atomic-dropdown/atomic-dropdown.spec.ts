import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AtomicDropdown, AtomicDropdownItem, AtomicDropdownModule } from './atomic-dropdown';

@Component({
  imports: [AtomicDropdownModule],
  template: `<app-atomic-dropdown [items]="items()" [disabled]="disabled()" [trigger]="trigger()">
    <button trigger type="button" id="trigger">Open</button>
  </app-atomic-dropdown>`,
})
class Host {
  readonly items = signal<AtomicDropdownItem[]>([]);
  readonly disabled = signal(false);
  readonly trigger = signal<'click' | 'hover'>('click');
}

@Component({
  imports: [AtomicDropdownModule],
  template: `<app-atomic-dropdown [items]="items()">
    <button trigger type="button" id="trigger">Open</button>
    <span *appMenuitemTemplate="let label; disabled as isDisabled; context as ctx" class="custom">
      {{ label }}/{{ ctx?.badge }}/{{ isDisabled }}
    </span>
  </app-atomic-dropdown>`,
})
class SlotHost {
  readonly items = signal<AtomicDropdownItem[]>([]);
}

const setup = async <T>(host: new () => T) => {
  await TestBed.configureTestingModule({ imports: [host as never] }).compileComponents();
  const fixture = TestBed.createComponent(host);
  await fixture.whenStable();
  return { fixture, component: fixture.componentInstance };
};

const el = (fixture: ComponentFixture<unknown>) => fixture.nativeElement as HTMLElement;
const menu = (fixture: ComponentFixture<unknown>) => el(fixture).querySelector('.atomic-dropdown');
const menuitems = (fixture: ComponentFixture<unknown>) =>
  Array.from(el(fixture).querySelectorAll<HTMLElement>('.atomic-dropdown__menuitem'));

const openMenu = async (fixture: ComponentFixture<unknown>) => {
  el(fixture).querySelector<HTMLElement>('#trigger')!.click();
  await fixture.whenStable();
};

const press = async (fixture: ComponentFixture<unknown>, target: HTMLElement, key: string) => {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
  await fixture.whenStable();
};

describe('AtomicDropdown', () => {
  describe('內容投影', () => {
    it('把 trigger 轉發進 popover 的 reference,否則使用者沒有東西可以點', async () => {
      const { fixture } = await setup(Host);

      const trigger = el(fixture).querySelector('#trigger');

      expect(trigger?.closest('.atomic-popover__reference')).toBeTruthy();
    });

    it('選單關閉時不渲染任何 menuitem', async () => {
      const { fixture, component } = await setup(Host);
      component.items.set([{ label: 'A', value: 'a' }]);
      await fixture.whenStable();

      expect(menu(fixture)).toBeNull();
    });
  });

  // 這是整個元件唯一不直觀的規則:onClick 宣告幾個參數,決定選單由誰關閉。
  // 少了它,「點完做事再自行關閉」這種需求就無法表達。
  describe('onClick 的參數個數決定關閉行為', () => {
    it('只宣告一個參數時,元件在呼叫後自動關閉選單', async () => {
      const { fixture, component } = await setup(Host);
      const received: unknown[] = [];
      component.items.set([{ label: 'A', value: 'a', onClick: (value) => received.push(value) }]);
      await openMenu(fixture);

      menuitems(fixture)[0].click();
      await fixture.whenStable();

      expect(received).toEqual(['a']);
      expect(menu(fixture)).toBeNull();
    });

    it('宣告第二個參數時,關閉權交給開發者,元件不主動關閉', async () => {
      const { fixture, component } = await setup(Host);
      component.items.set([
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        { label: 'A', value: 'a', onClick: (_value, _close) => undefined },
      ]);
      await openMenu(fixture);

      menuitems(fixture)[0].click();
      await fixture.whenStable();

      expect(menu(fixture)).not.toBeNull();
    });

    it('開發者呼叫傳入的 close 時選單才關閉', async () => {
      const { fixture, component } = await setup(Host);
      component.items.set([{ label: 'A', value: 'a', onClick: (_value, close) => close() }]);
      await openMenu(fixture);

      menuitems(fixture)[0].click();
      await fixture.whenStable();

      expect(menu(fixture)).toBeNull();
    });

    it('沒有 onClick 的項目點擊後仍關閉選單,不會卡在開啟狀態', async () => {
      const { fixture, component } = await setup(Host);
      component.items.set([{ label: 'A', value: 'a' }]);
      await openMenu(fixture);

      menuitems(fixture)[0].click();
      await fixture.whenStable();

      expect(menu(fixture)).toBeNull();
    });
  });

  describe('停用狀態', () => {
    it('停用的項目不呼叫 onClick,也不關閉選單', async () => {
      const { fixture, component } = await setup(Host);
      const onClick = vi.fn();
      component.items.set([{ label: 'A', value: 'a', disabled: true, onClick }]);
      await openMenu(fixture);

      menuitems(fixture)[0].click();
      await fixture.whenStable();

      expect(onClick).not.toHaveBeenCalled();
      expect(menu(fixture)).not.toBeNull();
    });

    it('元件層級的 disabled 讓選單完全打不開', async () => {
      const { fixture, component } = await setup(Host);
      component.items.set([{ label: 'A', value: 'a' }]);
      component.disabled.set(true);
      await fixture.whenStable();

      await openMenu(fixture);

      expect(menu(fixture)).toBeNull();
    });

    // 選單被元件層級的 disabled 擋住時根本打不開,所以這條合併規則在 DOM 上
    // 觀察不到,只能直接檢查 itemsCompose —— 但它必須成立,否則 disabled 的語意
    // 就會分裂成「選單打不開」和「項目仍可用」兩套。
    it('元件層級的 disabled 會併入每個項目', async () => {
      const { fixture, component } = await setup(Host);
      component.items.set([{ label: 'A', value: 'a' }]);
      component.disabled.set(true);
      await fixture.whenStable();

      const dropdown = fixture.debugElement.query(By.directive(AtomicDropdown))
        .componentInstance as AtomicDropdown;

      expect(dropdown.itemsCompose().map((item) => item.disabled)).toEqual([true]);
    });

    it('元件層級的 disabled 關閉後,項目回到各自的停用狀態', async () => {
      const { fixture, component } = await setup(Host);
      component.items.set([
        { label: 'A', value: 'a' },
        { label: 'B', value: 'b', disabled: true },
      ]);
      component.disabled.set(true);
      await fixture.whenStable();
      component.disabled.set(false);
      await fixture.whenStable();

      await openMenu(fixture);

      expect(menuitems(fixture).map((item) => item.getAttribute('aria-disabled'))).toEqual([
        null,
        'true',
      ]);
    });

    it('停用的項目標上 aria-disabled,方向鍵才會跳過它', async () => {
      const { fixture, component } = await setup(Host);
      component.items.set([
        { label: 'A', value: 'a' },
        { label: 'B', value: 'b', disabled: true },
      ]);
      await openMenu(fixture);

      expect(menuitems(fixture)[1].getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('無障礙結構', () => {
    it('以 menu / menuitem 角色描述選單,螢幕閱讀器才唸得出這是選單', async () => {
      const { fixture, component } = await setup(Host);
      component.items.set([{ label: 'A', value: 'a' }]);
      await openMenu(fixture);

      expect(menu(fixture)?.getAttribute('role')).toBe('menu');
      expect(menuitems(fixture)[0].getAttribute('role')).toBe('menuitem');
    });

    it('觸發元素宣告 aria-haspopup,使用者按下前就知道會開出浮層', async () => {
      const { fixture } = await setup(Host);

      const reference = el(fixture).querySelector('.atomic-popover__reference');

      expect(reference?.getAttribute('aria-haspopup')).toBe('true');
    });

    it('採 roving tabindex:整個選單只有一個 tab 停留點', async () => {
      const { fixture, component } = await setup(Host);
      component.items.set([
        { label: 'A', value: 'a' },
        { label: 'B', value: 'b' },
        { label: 'C', value: 'c' },
      ]);
      await openMenu(fixture);

      expect(menuitems(fixture).map((item) => item.getAttribute('tabindex'))).toEqual([
        '0',
        '-1',
        '-1',
      ]);
    });
  });

  describe('鍵盤操作', () => {
    const threeItems: AtomicDropdownItem[] = [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' },
      { label: 'C', value: 'c' },
    ];

    it('展開時焦點移入選單,否則綁在 <ul> 上的鍵盤處理永遠收不到事件', async () => {
      const { fixture, component } = await setup(Host);
      component.items.set(threeItems);
      await openMenu(fixture);

      expect(document.activeElement).toBe(menu(fixture));
    });

    it('ArrowDown 從選單本身移到第一個項目', async () => {
      const { fixture, component } = await setup(Host);
      component.items.set(threeItems);
      await openMenu(fixture);

      await press(fixture, document.activeElement as HTMLElement, 'ArrowDown');

      expect(document.activeElement).toBe(menuitems(fixture)[0]);
    });

    it('ArrowDown 逐項往下,走到底繞回第一項', async () => {
      const { fixture, component } = await setup(Host);
      component.items.set(threeItems);
      await openMenu(fixture);

      for (const expected of [0, 1, 2, 0]) {
        await press(fixture, document.activeElement as HTMLElement, 'ArrowDown');
        expect(document.activeElement).toBe(menuitems(fixture)[expected]);
      }
    });

    it('ArrowUp 從選單本身繞到最後一項', async () => {
      const { fixture, component } = await setup(Host);
      component.items.set(threeItems);
      await openMenu(fixture);

      await press(fixture, document.activeElement as HTMLElement, 'ArrowUp');

      expect(document.activeElement).toBe(menuitems(fixture)[2]);
    });

    it('Home / End 直接跳到頭尾', async () => {
      const { fixture, component } = await setup(Host);
      component.items.set(threeItems);
      await openMenu(fixture);

      await press(fixture, document.activeElement as HTMLElement, 'End');
      expect(document.activeElement).toBe(menuitems(fixture)[2]);

      await press(fixture, document.activeElement as HTMLElement, 'Home');
      expect(document.activeElement).toBe(menuitems(fixture)[0]);
    });

    it('Tab 關閉選單,使用者不會被困在選單裡', async () => {
      const { fixture, component } = await setup(Host);
      component.items.set(threeItems);
      await openMenu(fixture);

      await press(fixture, document.activeElement as HTMLElement, 'Tab');

      expect(menu(fixture)).toBeNull();
    });

    it('方向鍵跳過停用的項目', async () => {
      const { fixture, component } = await setup(Host);
      component.items.set([
        { label: 'A', value: 'a' },
        { label: 'B', value: 'b', disabled: true },
        { label: 'C', value: 'c' },
      ]);
      await openMenu(fixture);

      await press(fixture, document.activeElement as HTMLElement, 'ArrowDown');
      await press(fixture, document.activeElement as HTMLElement, 'ArrowDown');

      expect(document.activeElement).toBe(menuitems(fixture)[2]);
    });

    it('Enter 觸發項目 —— <li> 沒有原生按鈕語意,得自己補', async () => {
      const { fixture, component } = await setup(Host);
      const onClick = vi.fn();
      component.items.set([{ label: 'A', value: 'a', onClick }]);
      await openMenu(fixture);

      await press(fixture, menuitems(fixture)[0], 'Enter');

      expect(onClick).toHaveBeenCalledWith('a', expect.any(Function));
    });

    it('Space 同樣觸發項目', async () => {
      const { fixture, component } = await setup(Host);
      const onClick = vi.fn();
      component.items.set([{ label: 'A', value: 'a', onClick }]);
      await openMenu(fixture);

      await press(fixture, menuitems(fixture)[0], ' ');

      expect(onClick).toHaveBeenCalled();
    });

    it('其他按鍵不觸發項目', async () => {
      const { fixture, component } = await setup(Host);
      const onClick = vi.fn();
      component.items.set([{ label: 'A', value: 'a', onClick }]);
      await openMenu(fixture);

      await press(fixture, menuitems(fixture)[0], 'x');

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('menuitem slot', () => {
    it('沒有提供 slot 時退回顯示 label', async () => {
      const { fixture, component } = await setup(Host);
      component.items.set([{ label: 'A', value: 'a' }]);
      await openMenu(fixture);

      expect(menuitems(fixture)[0].textContent?.trim()).toBe('A');
      expect(el(fixture).querySelector('.custom')).toBeNull();
    });

    it('提供 slot 時由開發者決定內容,並拿得到 label / disabled / context', async () => {
      const { fixture, component } = await setup(SlotHost);
      component.items.set([{ label: 'A', value: 'a', disabled: true, context: { badge: 3 } }]);
      await openMenu(fixture);

      const custom = el(fixture).querySelector('.custom');

      expect(custom).not.toBeNull();
      expect(custom?.textContent?.replace(/\s+/g, '')).toBe('A/3/true');
    });
  });

  describe('trigger 設定', () => {
    it('trigger="hover" 時滑入即展開', async () => {
      const { fixture, component } = await setup(Host);
      component.items.set([{ label: 'A', value: 'a' }]);
      component.trigger.set('hover');
      await fixture.whenStable();

      el(fixture)
        .querySelector('.atomic-popover__reference')!
        .dispatchEvent(new MouseEvent('mouseenter'));
      await fixture.whenStable();

      expect(menu(fixture)).not.toBeNull();
    });
  });
});
