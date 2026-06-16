import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AtomicTabPanel } from './atomic-tab-panel';
import {
  ATOMIC_TABS,
  AtomicTabs,
  AtomicTabsChange,
  AtomicTabsItem,
  moveFocus,
  nextItem,
  previousItem,
} from './atomic-tabs';

const DEFAULT_ITEMS: AtomicTabsItem[] = [
  { value: 'tab1', label: 'Tab 1' },
  { value: 'tab2', label: 'Tab 2' },
  { value: 'tab3', label: 'Tab 3', disabled: true },
];

interface TabsInputs {
  items: AtomicTabsItem[];
  selectedValue: unknown;
  disabled: boolean;
  beforeChange: (e: AtomicTabsChange) => boolean | Promise<boolean>;
}

const setup = async (inputs: Partial<TabsInputs> = {}) => {
  await TestBed.configureTestingModule({
    imports: [AtomicTabs],
  }).compileComponents();

  const fixture = TestBed.createComponent(AtomicTabs);
  const component = fixture.componentInstance;

  fixture.componentRef.setInput('items', inputs.items ?? DEFAULT_ITEMS);
  fixture.componentRef.setInput('selectedValue', inputs.selectedValue ?? 'tab1');
  if (inputs.disabled !== undefined) fixture.componentRef.setInput('disabled', inputs.disabled);
  if (inputs.beforeChange) fixture.componentRef.setInput('beforeChange', inputs.beforeChange);

  fixture.detectChanges();

  return { fixture, component };
};

const tabButtons = (fixture: ComponentFixture<unknown>): HTMLButtonElement[] =>
  Array.from(fixture.nativeElement.querySelectorAll('.atomic-tabs__tab'));

const tabButton = (fixture: ComponentFixture<unknown>, label: string): HTMLButtonElement => {
  const button = tabButtons(fixture).find((b) => b.textContent!.trim() === label);
  if (!button) throw new Error(`tab button "${label}" not found`);
  return button;
};

describe('AtomicTabs', () => {
  it('should create', async () => {
    const { component } = await setup();

    expect(component).toBeTruthy();
  });

  describe('rendering', () => {
    it('renders one button per item with its label', async () => {
      const { fixture } = await setup();

      expect(tabButtons(fixture).map((b) => b.textContent!.trim())).toEqual([
        'Tab 1',
        'Tab 2',
        'Tab 3',
      ]);
    });

    it('marks only the selected tab with the selected modifier class', async () => {
      const { fixture } = await setup({ selectedValue: 'tab2' });

      expect(tabButton(fixture, 'Tab 2').classList.contains('atomic-tabs__tab--selected')).toBe(
        true
      );
      expect(tabButton(fixture, 'Tab 1').classList.contains('atomic-tabs__tab--selected')).toBe(
        false
      );
    });

    it('disables a tab whose item is flagged disabled', async () => {
      const { fixture } = await setup();

      expect(tabButton(fixture, 'Tab 3').disabled).toBe(true);
      expect(tabButton(fixture, 'Tab 1').disabled).toBe(false);
    });

    it('disables every tab when the component-level disabled input is set', async () => {
      const { fixture } = await setup({ disabled: true });

      expect(tabButtons(fixture).every((b) => b.disabled)).toBe(true);
    });
  });

  describe('onTabClick', () => {
    it('selects the clicked tab', async () => {
      const { fixture, component } = await setup({ selectedValue: 'tab1' });

      tabButton(fixture, 'Tab 2').click();
      await fixture.whenStable();

      expect(component.selectedValue()).toBe('tab2');
    });

    it('is a no-op when the already-selected tab is clicked', async () => {
      // The guard must not even run when nothing would change.
      const guard = vi.fn().mockReturnValue(true);
      const { component } = await setup({ selectedValue: 'tab1', beforeChange: guard });

      await component.onTabClick('tab1');

      expect(guard).not.toHaveBeenCalled();
      expect(component.selectedValue()).toBe('tab1');
    });

    it('changes selection when no guard is provided', async () => {
      const { component } = await setup({ selectedValue: 'tab1' });

      await component.onTabClick('tab2');

      expect(component.selectedValue()).toBe('tab2');
    });

    it('passes the from/to transition to the guard', async () => {
      const guard = vi.fn().mockReturnValue(true);
      const { component } = await setup({ selectedValue: 'tab1', beforeChange: guard });

      await component.onTabClick('tab2');

      expect(guard).toHaveBeenCalledWith({ from: 'tab1', to: 'tab2' });
    });

    it('commits the change when a synchronous guard returns true', async () => {
      const { component } = await setup({ selectedValue: 'tab1', beforeChange: () => true });

      await component.onTabClick('tab2');

      expect(component.selectedValue()).toBe('tab2');
    });

    it('blocks the change when a synchronous guard returns false', async () => {
      const { component } = await setup({ selectedValue: 'tab1', beforeChange: () => false });

      await component.onTabClick('tab2');

      expect(component.selectedValue()).toBe('tab1');
    });

    it('awaits a Promise guard before committing', async () => {
      const { component } = await setup({
        selectedValue: 'tab1',
        beforeChange: () => Promise.resolve(true),
      });

      await component.onTabClick('tab2');

      expect(component.selectedValue()).toBe('tab2');
    });

    it('blocks the change when a Promise guard resolves false', async () => {
      const { component } = await setup({
        selectedValue: 'tab1',
        beforeChange: () => Promise.resolve(false),
      });

      await component.onTabClick('tab2');

      expect(component.selectedValue()).toBe('tab1');
    });

    it('unwraps an Observable guard before committing', async () => {
      const { component } = await setup({
        selectedValue: 'tab1',
        // Cast: beforeChange's typed signature already permits Observable<boolean>.
        beforeChange: (() => of(true)) as never,
      });

      await component.onTabClick('tab2');

      expect(component.selectedValue()).toBe('tab2');
    });

    it('blocks the change when an Observable guard emits false', async () => {
      const { component } = await setup({
        selectedValue: 'tab1',
        beforeChange: (() => of(false)) as never,
      });

      await component.onTabClick('tab2');

      expect(component.selectedValue()).toBe('tab1');
    });
  });

  describe('two-way selectedValue binding', () => {
    @Component({
      imports: [AtomicTabs],
      template: `
        <app-atomic-tabs [items]="items" [(selectedValue)]="selected"></app-atomic-tabs>
      `,
    })
    class HostComponent {
      items = DEFAULT_ITEMS;
      selected = signal('tab1');
    }

    it('propagates a tab click back to the parent signal', async () => {
      await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
      const fixture = TestBed.createComponent(HostComponent);
      fixture.detectChanges();

      tabButton(fixture, 'Tab 2').click();
      await fixture.whenStable();

      expect(fixture.componentInstance.selected()).toBe('tab2');
    });
  });
});

describe('AtomicTabPanel', () => {
  const setupPanel = async (selectedValue: unknown, panelValue: unknown) => {
    const selected = signal(selectedValue);
    await TestBed.configureTestingModule({
      imports: [AtomicTabPanel],
      providers: [
        {
          provide: ATOMIC_TABS,
          useValue: { selectedValue: selected, lookup: signal(new Map()) },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AtomicTabPanel);
    fixture.componentRef.setInput('value', panelValue);
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('[role="tabpanel"]') as HTMLElement;
    return { fixture, component: fixture.componentInstance, selected, panel };
  };

  it('is selected and visible when its value matches the active tab', async () => {
    const { component, panel } = await setupPanel('a', 'a');

    expect(component.selected()).toBe(true);
    expect(panel.hidden).toBe(false);
  });

  it('is deselected and hidden when its value differs from the active tab', async () => {
    const { component, panel } = await setupPanel('a', 'b');

    expect(component.selected()).toBe(false);
    expect(panel.hidden).toBe(true);
  });

  it('reacts to the active tab changing', async () => {
    const { fixture, component, selected, panel } = await setupPanel('a', 'b');

    selected.set('b');
    fixture.detectChanges();

    expect(component.selected()).toBe(true);
    expect(panel.hidden).toBe(false);
  });
});

describe('AtomicTabs with AtomicTabPanel (integration)', () => {
  @Component({
    imports: [AtomicTabs, AtomicTabPanel],
    template: `
      <app-atomic-tabs [items]="items" [(selectedValue)]="selected">
        <app-atomic-tab-panel value="a"><p class="panel-a">A content</p></app-atomic-tab-panel>
        <app-atomic-tab-panel value="b"><p class="panel-b">B content</p></app-atomic-tab-panel>
      </app-atomic-tabs>
    `,
  })
  class HostComponent {
    items: AtomicTabsItem[] = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
    ];
    selected = signal('a');
  }

  const panel = (fixture: ComponentFixture<unknown>, cls: string): HTMLElement =>
    fixture.nativeElement.querySelector(`.${cls}`).closest('[role="tabpanel"]');

  it('shows the active panel and keeps the others in the DOM but hidden', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(panel(fixture, 'panel-a').hidden).toBe(false);
    // keep-alive: inactive panel content stays rendered (not destroyed), just hidden.
    expect(panel(fixture, 'panel-b').hidden).toBe(true);

    tabButton(fixture, 'B').click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(panel(fixture, 'panel-a').hidden).toBe(true);
    expect(panel(fixture, 'panel-b').hidden).toBe(false);
  });

  it('cross-links each tab and its panel via id / aria-controls / aria-labelledby', async () => {
    // The shared lookup exists so the tab and its separately-rendered panel agree on ids:
    // tab.aria-controls -> panel.id, and panel.aria-labelledby -> tab.id.
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const tabA = tabButton(fixture, 'A');
    const panelA = panel(fixture, 'panel-a');

    expect(tabA.id).toBeTruthy();
    expect(panelA.id).toBeTruthy();
    expect(tabA.getAttribute('aria-controls')).toBe(panelA.id);
    expect(panelA.getAttribute('aria-labelledby')).toBe(tabA.id);
  });
});

describe('AtomicTabs accessibility attributes', () => {
  it('marks the container with the tablist role', async () => {
    const { fixture } = await setup();

    expect(fixture.nativeElement.querySelector('[role="tablist"]')).toBeTruthy();
  });

  it('reflects selection state through aria-selected', async () => {
    const { fixture } = await setup({ selectedValue: 'tab2' });

    expect(tabButton(fixture, 'Tab 2').getAttribute('aria-selected')).toBe('true');
    expect(tabButton(fixture, 'Tab 1').getAttribute('aria-selected')).toBe('false');
  });

  it('keeps only the selected tab in the page tab order (roving tabindex)', async () => {
    // Why: Shift+Tab from the panel returns focus to the active tab, not to every tab.
    const { fixture } = await setup({ selectedValue: 'tab2' });

    expect(tabButton(fixture, 'Tab 2').tabIndex).toBe(0);
    expect(tabButton(fixture, 'Tab 1').tabIndex).toBe(-1);
  });

  it('forwards an accessible name to the tablist via aria-label', async () => {
    const { fixture } = await setup();
    fixture.componentRef.setInput('ariaLabel', 'Account sections');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="tablist"]').getAttribute('aria-label')).toBe(
      'Account sections'
    );
  });
});

describe('tab traversal helpers', () => {
  // A detached tablist of focusable <button>s; tests tweak tabindex / disabled per case.
  const buildTablist = (count: number) => {
    const container = document.createElement('div');
    const buttons = Array.from({ length: count }, () => {
      const button = document.createElement('button');
      button.setAttribute('tabindex', '-1');
      container.appendChild(button);
      return button;
    });
    return { container, buttons };
  };

  describe('nextItem', () => {
    it('returns the next sibling element', () => {
      const { container, buttons } = buildTablist(3);

      expect(nextItem(container, buttons[0])).toBe(buttons[1]);
    });

    it('wraps to the first element after the last', () => {
      const { container, buttons } = buildTablist(3);

      expect(nextItem(container, buttons[2])).toBe(buttons[0]);
    });

    it('returns the first element when there is no current item', () => {
      const { container, buttons } = buildTablist(3);

      expect(nextItem(container, null)).toBe(buttons[0]);
    });
  });

  describe('previousItem', () => {
    it('returns the previous sibling element', () => {
      const { container, buttons } = buildTablist(3);

      expect(previousItem(container, buttons[2])).toBe(buttons[1]);
    });

    it('wraps to the last element before the first', () => {
      const { container, buttons } = buildTablist(3);

      expect(previousItem(container, buttons[0])).toBe(buttons[2]);
    });

    it('returns the last element when there is no current item', () => {
      const { container, buttons } = buildTablist(3);

      expect(previousItem(container, null)).toBe(buttons[2]);
    });
  });

  describe('moveFocus', () => {
    it('focuses the next focusable element and reports success', () => {
      const { container, buttons } = buildTablist(2);
      const focus = vi.spyOn(buttons[1], 'focus');

      expect(moveFocus(container, buttons[0], nextItem)).toBe(true);
      expect(focus).toHaveBeenCalled();
    });

    it('skips a disabled element', () => {
      const { container, buttons } = buildTablist(3);
      buttons[1].disabled = true;
      const skipped = vi.spyOn(buttons[1], 'focus');
      const landed = vi.spyOn(buttons[2], 'focus');

      moveFocus(container, buttons[0], nextItem);

      expect(skipped).not.toHaveBeenCalled();
      expect(landed).toHaveBeenCalled();
    });

    it('skips an element without a tabindex attribute', () => {
      const { container, buttons } = buildTablist(3);
      buttons[1].removeAttribute('tabindex');
      const skipped = vi.spyOn(buttons[1], 'focus');
      const landed = vi.spyOn(buttons[2], 'focus');

      moveFocus(container, buttons[0], nextItem);

      expect(skipped).not.toHaveBeenCalled();
      expect(landed).toHaveBeenCalled();
    });

    it('reports failure when there is nothing to focus', () => {
      const container = document.createElement('div');

      expect(moveFocus(container, null, nextItem)).toBe(false);
    });
  });
});

describe('onTabKeydown (keyboard navigation)', () => {
  let host: HTMLElement | undefined;

  // Attach to the document so .focus() / document.activeElement behave like the browser.
  const render = async (selectedValue: unknown = 'tab1') => {
    const { fixture } = await setup({ selectedValue });
    host = fixture.nativeElement as HTMLElement;
    document.body.appendChild(host);
    return { fixture };
  };

  const press = (el: HTMLElement, key: string) => {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
    el.dispatchEvent(event);
    return event;
  };

  afterEach(() => {
    host?.remove();
    host = undefined;
  });

  it('moves focus to the next tab on ArrowRight', async () => {
    const { fixture } = await render('tab1');
    const [tab1, tab2] = tabButtons(fixture);
    tab1.focus();

    press(tab1, 'ArrowRight');

    expect(document.activeElement).toBe(tab2);
  });

  it('skips disabled tabs and wraps around on ArrowRight', async () => {
    // Tab 3 is disabled, so ArrowRight from Tab 2 wraps past it back to Tab 1.
    const { fixture } = await render('tab1');
    const [tab1, tab2] = tabButtons(fixture);
    tab2.focus();

    press(tab2, 'ArrowRight');

    expect(document.activeElement).toBe(tab1);
  });

  it('moves focus to the previous focusable tab on ArrowLeft', async () => {
    // ArrowLeft from Tab 1 wraps to the end; Tab 3 is disabled, so it lands on Tab 2.
    const { fixture } = await render('tab1');
    const [tab1, tab2] = tabButtons(fixture);
    tab1.focus();

    press(tab1, 'ArrowLeft');

    expect(document.activeElement).toBe(tab2);
  });

  it('moves focus to the first tab on Home', async () => {
    const { fixture } = await render('tab2');
    const [tab1, tab2] = tabButtons(fixture);
    tab2.focus();

    press(tab2, 'Home');

    expect(document.activeElement).toBe(tab1);
  });

  it('moves focus to the last focusable tab on End', async () => {
    // Last tab (Tab 3) is disabled, so End lands on Tab 2.
    const { fixture } = await render('tab1');
    const [tab1, tab2] = tabButtons(fixture);
    tab1.focus();

    press(tab1, 'End');

    expect(document.activeElement).toBe(tab2);
  });

  it('prevents default for navigation keys to stop the page scrolling', async () => {
    const { fixture } = await render('tab1');
    const [tab1] = tabButtons(fixture);
    tab1.focus();

    const event = press(tab1, 'ArrowRight');

    expect(event.defaultPrevented).toBe(true);
  });

  it('ignores keys that are not navigation keys', async () => {
    const { fixture } = await render('tab1');
    const [tab1] = tabButtons(fixture);
    tab1.focus();

    const event = press(tab1, 'a');

    expect(event.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(tab1);
  });
});
