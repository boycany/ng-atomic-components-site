import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoPreloading, provideRouter, withPreloading } from '@angular/router';

import { BreadcrumbItem } from '../../shared/components/atomic-breadcrumb/atomic-breadcrumb.types';
import { BreadcrumbShowcase } from './breadcrumb-showcase';

interface SeparatorOption {
  label: string;
  value: string;
}

interface BreadcrumbShowcaseInternals {
  basicItems: BreadcrumbItem[];
  stringSeparators: SeparatorOption[];
  staticItems: BreadcrumbItem[];
}

const setup = async () => {
  await TestBed.configureTestingModule({
    imports: [BreadcrumbShowcase],
    providers: [provideRouter([], withPreloading(NoPreloading))],
  }).compileComponents();

  const fixture = TestBed.createComponent(BreadcrumbShowcase);
  const component = fixture.componentInstance as unknown as BreadcrumbShowcaseInternals;
  fixture.detectChanges();

  return { fixture, component };
};

describe('BreadcrumbShowcase', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should render the page title', async () => {
    const { fixture } = await setup();
    const h1 = fixture.debugElement.query(By.css('h1'));
    expect(h1.nativeElement.textContent).toBe('Breadcrumbs');
  });

  it('should render 9 breadcrumb components (1 default + 5 custom separators + 1 static + 1 label-with-icon + 1 icon-only)', async () => {
    const { fixture } = await setup();
    const breadcrumbs = fixture.debugElement.queryAll(By.css('app-atomic-breadcrumb'));
    expect(breadcrumbs.length).toBe(9);
  });

  describe('data: basicItems', () => {
    it('should have 4 items', async () => {
      const { component } = await setup();
      expect(component.basicItems).toHaveLength(4);
    });

    it('should start with Home linking to /', async () => {
      const { component } = await setup();
      expect(component.basicItems[0]).toEqual({ label: 'Home', to: '/' });
    });

    it('should end with a non-linked Current Page', async () => {
      const { component } = await setup();
      const last = component.basicItems[3];
      expect(last).toEqual({ label: 'Current Page' });
      expect(last.to).toBeUndefined();
    });
  });

  describe('data: stringSeparators', () => {
    it('should have 5 separator options', async () => {
      const { component } = await setup();
      expect(component.stringSeparators).toHaveLength(5);
    });

    it('should include >, », •, |, → as separator values', async () => {
      const { component } = await setup();
      const values = component.stringSeparators.map((s) => s.value);
      expect(values).toEqual(['>', '»', '•', '|', '→']);
    });

    it('should have matching label and value for each separator', async () => {
      const { component } = await setup();
      for (const sep of component.stringSeparators) {
        expect(sep.label).toBe(sep.value);
      }
    });
  });

  describe('data: staticItems', () => {
    it('should have 3 items, all without links', async () => {
      const { component } = await setup();
      expect(component.staticItems).toHaveLength(3);
      for (const item of component.staticItems) {
        expect(item.to).toBeUndefined();
      }
    });
  });

  describe('template: default separator section', () => {
    it('should render the "Default separator" label', async () => {
      const { fixture } = await setup();
      const paragraphs = fixture.debugElement.queryAll(By.css('p'));
      expect(paragraphs[0].nativeElement.textContent).toBe('Default separator');
    });
  });

  describe('template: custom separators section', () => {
    it('should render 5 sep-label spans', async () => {
      const { fixture } = await setup();
      const labels = fixture.debugElement.queryAll(By.css('.sep-label'));
      expect(labels.length).toBe(5);
    });

    it('should display each separator value as the span text', async () => {
      const { fixture, component } = await setup();
      const labels = fixture.debugElement.queryAll(By.css('.sep-label'));
      const expectedValues = component.stringSeparators.map((s) => s.label);
      labels.forEach((label, i) => {
        expect(label.nativeElement.textContent.trim()).toBe(expectedValues[i]);
      });
    });

    it('should render the "Custom string separators" label', async () => {
      const { fixture } = await setup();
      const paragraphs = fixture.debugElement.queryAll(By.css('p'));
      expect(paragraphs[1].nativeElement.textContent).toBe('Custom string separators');
    });
  });

  describe('template: static items section', () => {
    it('should render the "All non-clickable (current page only)" label', async () => {
      const { fixture } = await setup();
      const paragraphs = fixture.debugElement.queryAll(By.css('p'));
      expect(paragraphs[2].nativeElement.textContent).toBe('All non-clickable (current page only)');
    });
  });
});
