import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AtomicTabPanel } from './atomic-tab-panel';
import { ATOMIC_TABS, AtomicTabs, AtomicTabsChange, AtomicTabsItem } from './atomic-tabs';

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
      providers: [{ provide: ATOMIC_TABS, useValue: { selectedValue: selected } }],
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
});
