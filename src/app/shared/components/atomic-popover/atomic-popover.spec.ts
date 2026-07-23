import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AtomicPopover } from './atomic-popover';
import { Trigger } from './atomic-popover-utils';

@Component({
  imports: [AtomicPopover],
  template: `
    <app-atomic-popover [trigger]="trigger">
      <button trigger>Open</button>
      <div>Popover body</div>
    </app-atomic-popover>
  `,
})
class HostComponent {
  trigger: Trigger | Trigger[] = 'click';
}

const setup = async (trigger: Trigger | Trigger[] = 'click') => {
  await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
  const fixture = TestBed.createComponent(HostComponent);
  fixture.componentInstance.trigger = trigger;
  fixture.detectChanges();

  const popover = fixture.debugElement.query(By.directive(AtomicPopover))
    .componentInstance as AtomicPopover;
  const reference = fixture.nativeElement.querySelector(
    '.atomic-popover__reference'
  ) as HTMLElement;

  const popoverEl = () =>
    fixture.nativeElement.querySelector('.atomic-popover') as HTMLElement | null;

  return { fixture, popover, reference, popoverEl };
};

describe('AtomicPopover', () => {
  it('should create', async () => {
    const { popover } = await setup();
    expect(popover).toBeTruthy();
  });

  it('預設隱藏,沒有 popover 內容區', async () => {
    const { popover, popoverEl } = await setup();
    expect(popover.modelValue()).toBe(false);
    expect(popoverEl()).toBeNull();
  });

  it('投影 [trigger] 與預設內容', async () => {
    const { fixture, reference, popoverEl } = await setup('click');
    expect(reference.textContent).toContain('Open');

    reference.click();
    fixture.detectChanges();

    expect(popoverEl()?.textContent).toContain('Popover body');
  });

  describe('trigger: click', () => {
    it('點擊切換顯示,並反映在 aria-expanded', async () => {
      const { fixture, popover, reference, popoverEl } = await setup('click');

      reference.click();
      fixture.detectChanges();
      expect(popover.modelValue()).toBe(true);
      expect(popoverEl()).not.toBeNull();
      expect(reference.getAttribute('aria-expanded')).toBe('true');

      reference.click();
      fixture.detectChanges();
      expect(popover.modelValue()).toBe(false);
      expect(reference.getAttribute('aria-expanded')).toBe('false');
    });

    it('Enter / Space 鍵切換顯示', async () => {
      const { fixture, popover, reference } = await setup('click');

      reference.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      fixture.detectChanges();
      expect(popover.modelValue()).toBe(true);

      reference.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      fixture.detectChanges();
      expect(popover.modelValue()).toBe(false);
    });

    it('忽略其他按鍵', async () => {
      const { fixture, popover, reference } = await setup('click');
      reference.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
      fixture.detectChanges();
      expect(popover.modelValue()).toBe(false);
    });

    it('鍵盤事件來自投影的 <button> 時交給原生處理,不重複觸發', async () => {
      const { fixture, popover } = await setup('click');
      const projectedButton = fixture.nativeElement.querySelector(
        'button[trigger]'
      ) as HTMLButtonElement;
      projectedButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      fixture.detectChanges();
      expect(popover.modelValue()).toBe(false);
    });
  });

  describe('trigger: hover', () => {
    it('mouseenter 開啟、mouseleave 關閉', async () => {
      const { fixture, popover, reference } = await setup('hover');

      reference.dispatchEvent(new MouseEvent('mouseenter'));
      fixture.detectChanges();
      expect(popover.modelValue()).toBe(true);

      reference.dispatchEvent(new MouseEvent('mouseleave'));
      fixture.detectChanges();
      expect(popover.modelValue()).toBe(false);
    });

    it('trigger 為 hover 時,點擊與按鍵不會開啟', async () => {
      const { fixture, popover, reference } = await setup('hover');
      reference.click();
      reference.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      fixture.detectChanges();
      expect(popover.modelValue()).toBe(false);
    });
  });

  it('未命中的 trigger 事件一律忽略(trigger 為 click 時)', async () => {
    const { fixture, popover, reference } = await setup('click');

    for (const type of ['mouseenter', 'mouseleave', 'focus', 'blur', 'touchstart', 'touchend']) {
      reference.dispatchEvent(new Event(type));
    }
    fixture.detectChanges();

    expect(popover.modelValue()).toBe(false);
  });

  describe('trigger: focus', () => {
    it('focus 開啟、blur 關閉', async () => {
      const { fixture, popover, reference } = await setup('focus');

      reference.dispatchEvent(new FocusEvent('focus'));
      fixture.detectChanges();
      expect(popover.modelValue()).toBe(true);

      reference.dispatchEvent(new FocusEvent('blur'));
      fixture.detectChanges();
      expect(popover.modelValue()).toBe(false);
    });
  });

  describe('trigger: touch', () => {
    it('touchstart 開啟、touchend 關閉', async () => {
      const { fixture, popover, reference } = await setup('touch');

      reference.dispatchEvent(new Event('touchstart'));
      fixture.detectChanges();
      expect(popover.modelValue()).toBe(true);

      reference.dispatchEvent(new Event('touchend'));
      fixture.detectChanges();
      expect(popover.modelValue()).toBe(false);
    });
  });

  it('支援多種 trigger(陣列)', async () => {
    const { fixture, popover, reference } = await setup(['click', 'hover']);

    reference.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect(popover.modelValue()).toBe(true);

    reference.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    reference.click();
    fixture.detectChanges();
    expect(popover.modelValue()).toBe(true);
  });

  it('可用 modelValue 從外部控制顯示', async () => {
    const { fixture, popover, popoverEl } = await setup('click');
    popover.modelValue.set(true);
    fixture.detectChanges();
    expect(popoverEl()).not.toBeNull();
  });

  describe('click outside', () => {
    it('點擊外部關閉', async () => {
      const { fixture, popover, reference } = await setup('click');
      reference.click();
      fixture.detectChanges();
      expect(popover.modelValue()).toBe(true);

      document.body.click();
      fixture.detectChanges();
      expect(popover.modelValue()).toBe(false);
    });

    it('點擊 popover 內部不關閉', async () => {
      const { fixture, popover, popoverEl } = await setup('click');
      popover.modelValue.set(true);
      fixture.detectChanges();

      popoverEl()!.click();
      fixture.detectChanges();
      expect(popover.modelValue()).toBe(true);
    });
  });

  describe('定位', () => {
    it('popover 套用 absolute 定位樣式', async () => {
      const { fixture, reference, popoverEl } = await setup('click');
      reference.click();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const el = popoverEl()!;
      expect(el.style.position).toBe('absolute');
      expect(el.style.transform).toContain('translate');
    });

    it('視窗縮放時重新量測且不影響顯示', async () => {
      const { fixture, popover, reference, popoverEl } = await setup('click');
      reference.click();
      fixture.detectChanges();

      window.dispatchEvent(new Event('resize'));
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(popover.modelValue()).toBe(true);
      expect(popoverEl()?.style.position).toBe('absolute');
    });
  });

  describe('accessibility', () => {
    it('reference 具備 button 語意與可聚焦性', async () => {
      const { reference } = await setup('click');
      expect(reference.getAttribute('role')).toBe('button');
      expect(reference.tabIndex).toBe(0);
      expect(reference.getAttribute('aria-expanded')).toBe('false');
    });
  });
});
