import { Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Expander } from './expander';
import { ExpanderToggle } from './expander-toggle';
import { ExpanderToggleComponent } from './expander-toggle.component';

@Component({
  imports: [Expander],
  template: `
    <app-expander>
      <span appExpanderHeader class="projected-header">Test Header</span>
      <p class="projected-content">Projected Content</p>
    </app-expander>
  `,
})
class TestHostWithContent {}

@Component({
  imports: [Expander, ExpanderToggle],
  template: `
    <app-expander>
      <span appExpanderHeader>Header</span>
      <button appExpanderToggle class="custom-toggle" type="button">Toggle</button>
    </app-expander>
  `,
})
class TestHostWithToggleDirective {
  readonly expander = viewChild.required(Expander);
}

@Component({
  imports: [Expander, ExpanderToggle, ExpanderToggleComponent],
  template: `
    <app-expander>
      <span appExpanderHeader>Header</span>
      <button appExpanderToggle type="button" class="custom-toggle">
        <app-expander-toggle>
          <span expander-open class="open-slot">OPEN</span>
          <span expander-close class="close-slot">CLOSE</span>
        </app-expander-toggle>
      </button>
    </app-expander>
  `,
})
class TestHostWithToggleComponent {
  readonly expander = viewChild.required(Expander);
}

const setup = async () => {
  await TestBed.configureTestingModule({
    imports: [Expander],
  }).compileComponents();

  const fixture = TestBed.createComponent(Expander);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return { fixture, component };
};

describe('Expander', () => {
  it('should create', async () => {
    const { component } = await setup();

    expect(component).toBeTruthy();
  });

  it('should be collapsed by default', async () => {
    const { component } = await setup();

    expect(component.isExpanded()).toBe(false);
    expect(component.isCollapsed()).toBe(true);
  });

  it('should apply collapsed host class initially', async () => {
    const { fixture } = await setup();

    expect(fixture.nativeElement.classList.contains('collapsed')).toBe(true);
    expect(fixture.nativeElement.classList.contains('expanded')).toBe(false);
  });

  it('should expand after toggle()', async () => {
    const { fixture, component } = await setup();

    component.toggle();
    fixture.detectChanges();

    expect(component.isExpanded()).toBe(true);
    expect(component.isCollapsed()).toBe(false);
    expect(fixture.nativeElement.classList.contains('expanded')).toBe(true);
    expect(fixture.nativeElement.classList.contains('collapsed')).toBe(false);
  });

  it('should collapse after toggle() called twice', async () => {
    const { fixture, component } = await setup();

    component.toggle();
    fixture.detectChanges();
    component.toggle();
    fixture.detectChanges();

    expect(component.isExpanded()).toBe(false);
    expect(component.isCollapsed()).toBe(true);
  });

  it('should project appExpanderHeader content into the header area', async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostWithContent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostWithContent);
    fixture.detectChanges();

    const headerEl = fixture.nativeElement.querySelector('.header-area') as HTMLElement;
    const projectedHeader = headerEl.querySelector('.projected-header') as HTMLElement | null;

    expect(projectedHeader).not.toBeNull();
    expect(projectedHeader?.textContent?.trim()).toBe('Test Header');
    expect(headerEl.textContent?.trim()).toBe('Test Header');
  });

  it('should hide content area when collapsed', async () => {
    const { fixture } = await setup();

    const contentArea = fixture.nativeElement.querySelector('.content-area') as HTMLElement | null;
    expect(contentArea).toBeNull();
  });

  it('should show content area when expanded', async () => {
    const { fixture, component } = await setup();

    component.toggle();
    fixture.detectChanges();

    const contentArea = fixture.nativeElement.querySelector('.content-area') as HTMLElement | null;
    expect(contentArea).not.toBeNull();
  });

  it('should render default toggle with "More" label when collapsed', async () => {
    const { fixture } = await setup();

    const toggleArea = fixture.nativeElement.querySelector('.toggle-area') as HTMLElement;
    expect(toggleArea.textContent?.trim()).toBe('More');
  });

  it('should render default toggle with "Less" label when expanded', async () => {
    const { fixture, component } = await setup();

    component.toggle();
    fixture.detectChanges();
    await fixture.whenStable();

    const toggleArea = fixture.nativeElement.querySelector('.toggle-area') as HTMLElement;
    expect(toggleArea.textContent?.trim()).toBe('Less');
  });

  it('should toggle when the default toggle button is clicked', async () => {
    const { fixture, component } = await setup();

    const button = fixture.nativeElement.querySelector(
      '.toggle-area app-atomic-button'
    ) as HTMLElement;
    button.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.isExpanded()).toBe(true);
  });

  it('should report hasCustomToggle() as false when no custom toggle is projected', async () => {
    const { component } = await setup();

    expect(component.hasCustomToggle()).toBe(false);
  });

  it('should project content into content-area when expanded', async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostWithContent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostWithContent);
    fixture.detectChanges();

    const expanderEl = fixture.nativeElement.querySelector('app-expander') as HTMLElement;
    const expanderComponent = fixture.debugElement.query(
      (el) => el.componentInstance instanceof Expander
    )?.componentInstance as Expander;

    expanderComponent.toggle();
    fixture.detectChanges();

    const projected = expanderEl.querySelector('.projected-content') as HTMLElement | null;
    expect(projected).not.toBeNull();
    expect(projected?.textContent?.trim()).toBe('Projected Content');
  });

  it('should detect a projected appExpanderToggle directive and suppress the default toggle', async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostWithToggleDirective],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostWithToggleDirective);
    fixture.detectChanges();
    await fixture.whenStable();

    const expander = fixture.componentInstance.expander();
    expect(expander.hasCustomToggle()).toBe(true);

    const toggleArea = fixture.nativeElement.querySelector('.toggle-area') as HTMLElement;
    expect(toggleArea.querySelector('app-atomic-button')).toBeNull();
    expect(toggleArea.querySelector('.custom-toggle')).not.toBeNull();
  });

  it('should toggle the expander when a projected appExpanderToggle is clicked', async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostWithToggleDirective],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostWithToggleDirective);
    fixture.detectChanges();
    await fixture.whenStable();

    const expander = fixture.componentInstance.expander();
    const customToggle = fixture.nativeElement.querySelector('.custom-toggle') as HTMLElement;

    customToggle.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(expander.isExpanded()).toBe(true);

    customToggle.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(expander.isExpanded()).toBe(false);
  });

  it('should detect a projected app-expander-toggle component and swap its open/close slots', async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostWithToggleComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostWithToggleComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const expander = fixture.componentInstance.expander();
    expect(expander.hasCustomToggle()).toBe(true);

    const toggleEl = fixture.nativeElement.querySelector('app-expander-toggle') as HTMLElement;
    expect(toggleEl.querySelector('.close-slot')).not.toBeNull();
    expect(toggleEl.querySelector('.open-slot')).toBeNull();

    expander.toggle();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(toggleEl.querySelector('.open-slot')).not.toBeNull();
    expect(toggleEl.querySelector('.close-slot')).toBeNull();
  });
});
