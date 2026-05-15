import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Expander } from './expander';

@Component({
  imports: [Expander],
  template: `
    <app-expander header="Test Header">
      <p class="projected-content">Projected Content</p>
    </app-expander>
  `,
})
class TestHostWithContent {}

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

  it('should render header input', async () => {
    const { fixture } = await setup();

    fixture.componentRef.setInput('header', 'My Section');
    fixture.detectChanges();

    const headerEl = fixture.nativeElement.querySelector('.header-area') as HTMLElement;
    expect(headerEl.textContent?.trim()).toBe('My Section');
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

  it('should show keyboard_arrow_down icon when collapsed', async () => {
    const { fixture } = await setup();

    const icon = fixture.nativeElement.querySelector('mat-icon') as HTMLElement;
    expect(icon.textContent?.trim()).toBe('keyboard_arrow_down');
  });

  it('should show keyboard_arrow_up icon when expanded', async () => {
    const { fixture, component } = await setup();

    component.toggle();
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('mat-icon') as HTMLElement;
    expect(icon.textContent?.trim()).toBe('keyboard_arrow_up');
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
});
