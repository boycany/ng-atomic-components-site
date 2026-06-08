import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AtomicPagination } from './atomic-pagination';

interface PaginationInputs {
  page: number;
  perPage: number;
  total: number;
  boundaryCount: number;
  siblingCount: number;
  hidePrevButton: boolean;
  hideNextButton: boolean;
  showFirstButton: boolean;
  showLastButton: boolean;
  disabled: boolean;
}

const setup = async (inputs: Partial<PaginationInputs> = {}) => {
  await TestBed.configureTestingModule({
    imports: [AtomicPagination],
    providers: [provideRouter([])],
  }).compileComponents();

  const fixture = TestBed.createComponent(AtomicPagination);
  const component = fixture.componentInstance;

  // Required inputs, with sensible defaults so each test only sets what it cares about.
  fixture.componentRef.setInput('page', inputs.page ?? 1);
  fixture.componentRef.setInput('perPage', inputs.perPage ?? 10);
  fixture.componentRef.setInput('total', inputs.total ?? 100);

  const optional: (keyof PaginationInputs)[] = [
    'boundaryCount',
    'siblingCount',
    'hidePrevButton',
    'hideNextButton',
    'showFirstButton',
    'showLastButton',
    'disabled',
  ];
  for (const key of optional) {
    if (inputs[key] !== undefined) {
      fixture.componentRef.setInput(key, inputs[key]);
    }
  }

  fixture.detectChanges();

  return { fixture, component };
};

/** Page-number buttons are the only ones rendered with a `[label]` slot. */
const pageLabels = (fixture: ComponentFixture<unknown>): string[] =>
  Array.from(fixture.nativeElement.querySelectorAll('span[label]')).map((el) =>
    (el as HTMLElement).textContent!.trim()
  );

const ellipsisCount = (fixture: ComponentFixture<unknown>): number =>
  fixture.nativeElement.querySelectorAll('.atomic-pagination__button--ellipsis').length;

const navButton = (
  fixture: ComponentFixture<unknown>,
  name: 'first' | 'previous' | 'next' | 'last'
): HTMLButtonElement | null =>
  fixture.nativeElement.querySelector(`.atomic-pagination__button--${name} button`);

const pageButton = (fixture: ComponentFixture<unknown>, pageNumber: number): HTMLButtonElement => {
  const span = Array.from(fixture.nativeElement.querySelectorAll('span[label]')).find(
    (el) => (el as HTMLElement).textContent!.trim() === String(pageNumber)
  );
  if (!span) throw new Error(`page button ${pageNumber} not found`);
  return (span as HTMLElement).closest('app-atomic-button')!.querySelector('button')!;
};

describe('AtomicPagination', () => {
  it('should create', async () => {
    const { component } = await setup();

    expect(component).toBeTruthy();
  });

  describe('page count', () => {
    it('derives the page count by rounding total / perPage up', async () => {
      // 95 items / 10 per page must still surface a 10th page for the remainder.
      const { component } = await setup({ total: 95, perPage: 10 });

      expect(component.count()).toBe(10);
      expect(component.pageNumbers()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
  });

  describe('rendered page window', () => {
    it('shows boundaries, the sibling window and both ellipses on a middle page', async () => {
      const { fixture } = await setup({ total: 100, perPage: 10, page: 5 });

      // 1 … 4 5 6 … 10
      expect(pageLabels(fixture)).toEqual(['1', '4', '5', '6', '10']);
      expect(ellipsisCount(fixture)).toBe(2);
    });

    it('omits the start ellipsis on the first page', async () => {
      const { fixture } = await setup({ total: 100, perPage: 10, page: 1 });

      // 1 2 3 4 … 10
      expect(pageLabels(fixture)).toEqual(['1', '2', '3', '4', '10']);
      expect(ellipsisCount(fixture)).toBe(1);
    });

    it('omits the end ellipsis on the last page', async () => {
      const { fixture } = await setup({ total: 100, perPage: 10, page: 10 });

      // 1 … 7 8 9 10
      expect(pageLabels(fixture)).toEqual(['1', '7', '8', '9', '10']);
      expect(ellipsisCount(fixture)).toBe(1);
    });

    it('honours custom boundaryCount and siblingCount', async () => {
      const { fixture } = await setup({
        total: 1000,
        perPage: 10,
        page: 50,
        boundaryCount: 2,
        siblingCount: 2,
      });

      // 1 2 … 48 49 50 51 52 … 99 100
      expect(pageLabels(fixture)).toEqual(['1', '2', '48', '49', '50', '51', '52', '99', '100']);
      expect(ellipsisCount(fixture)).toBe(2);
    });

    // Regression: count === 1 leaves endPages empty; the ellipsis check must key
    // off the boundary edge, not array length, or it renders a stray ellipsis.
    it('renders a single page with no ellipsis when there is only one page', async () => {
      const { fixture } = await setup({ total: 10, perPage: 10, page: 1 });

      expect(pageLabels(fixture)).toEqual(['1']);
      expect(ellipsisCount(fixture)).toBe(0);
    });
  });

  describe('navigation button visibility', () => {
    it('shows previous and next but hides first and last by default', async () => {
      const { fixture } = await setup({ page: 5 });

      expect(navButton(fixture, 'previous')).toBeTruthy();
      expect(navButton(fixture, 'next')).toBeTruthy();
      expect(navButton(fixture, 'first')).toBeNull();
      expect(navButton(fixture, 'last')).toBeNull();
    });

    it('reveals first and last buttons when requested', async () => {
      const { fixture } = await setup({ page: 5, showFirstButton: true, showLastButton: true });

      expect(navButton(fixture, 'first')).toBeTruthy();
      expect(navButton(fixture, 'last')).toBeTruthy();
    });

    it('hides previous and next buttons when requested', async () => {
      const { fixture } = await setup({ page: 5, hidePrevButton: true, hideNextButton: true });

      expect(navButton(fixture, 'previous')).toBeNull();
      expect(navButton(fixture, 'next')).toBeNull();
    });
  });

  describe('navigation button disabled state', () => {
    it('disables previous and first on the first page', async () => {
      const { fixture } = await setup({ page: 1, showFirstButton: true });

      expect(navButton(fixture, 'previous')!.disabled).toBe(true);
      expect(navButton(fixture, 'first')!.disabled).toBe(true);
      expect(navButton(fixture, 'next')!.disabled).toBe(false);
    });

    it('disables next and last on the last page', async () => {
      const { fixture } = await setup({ page: 10, showLastButton: true });

      expect(navButton(fixture, 'next')!.disabled).toBe(true);
      expect(navButton(fixture, 'last')!.disabled).toBe(true);
      expect(navButton(fixture, 'previous')!.disabled).toBe(false);
    });

    it('disables every control when disabled is set', async () => {
      const { fixture } = await setup({
        page: 5,
        disabled: true,
        showFirstButton: true,
        showLastButton: true,
      });

      expect(navButton(fixture, 'first')!.disabled).toBe(true);
      expect(navButton(fixture, 'previous')!.disabled).toBe(true);
      expect(navButton(fixture, 'next')!.disabled).toBe(true);
      expect(navButton(fixture, 'last')!.disabled).toBe(true);
      expect(pageButton(fixture, 5).disabled).toBe(true);
    });
  });

  describe('navigation interactions', () => {
    it('advances to the next page', async () => {
      const { fixture, component } = await setup({ page: 5 });

      navButton(fixture, 'next')!.click();

      expect(component.page()).toBe(6);
    });

    it('goes back to the previous page', async () => {
      const { fixture, component } = await setup({ page: 5 });

      navButton(fixture, 'previous')!.click();

      expect(component.page()).toBe(4);
    });

    it('jumps to the first and last page', async () => {
      const { fixture, component } = await setup({
        page: 5,
        showFirstButton: true,
        showLastButton: true,
      });

      navButton(fixture, 'last')!.click();
      expect(component.page()).toBe(10);

      navButton(fixture, 'first')!.click();
      expect(component.page()).toBe(1);
    });

    it('navigates to a clicked page number', async () => {
      const { fixture, component } = await setup({ page: 1 });

      pageButton(fixture, 4).click();

      expect(component.page()).toBe(4);
    });
  });

  describe('updatePage guards', () => {
    it('ignores values below the first page', async () => {
      const { component } = await setup({ page: 5 });

      component.updatePage(0);

      expect(component.page()).toBe(5);
    });

    it('ignores values beyond the last page', async () => {
      const { component } = await setup({ page: 5, total: 100, perPage: 10 });

      component.updatePage(11);

      expect(component.page()).toBe(5);
    });

    it('accepts an in-range page', async () => {
      const { component } = await setup({ page: 5 });

      component.updatePage(7);

      expect(component.page()).toBe(7);
    });
  });

  describe('accessibility of page buttons', () => {
    it('marks the current page with aria-current and drops its aria-label', async () => {
      const { fixture } = await setup({ page: 5 });

      const current = pageButton(fixture, 5);
      expect(current.getAttribute('aria-current')).toBe('page');
      expect(current.getAttribute('aria-label')).toBeNull();
    });

    it('labels non-current pages and leaves aria-current unset', async () => {
      const { fixture } = await setup({ page: 5 });

      const other = pageButton(fixture, 4);
      expect(other.getAttribute('aria-current')).toBeNull();
      expect(other.getAttribute('aria-label')).toBe('Go to page 4');
    });

    it('renders the current page as contained and others as outlined', async () => {
      const { fixture } = await setup({ page: 5 });

      expect(pageButton(fixture, 5).classList.contains('atomic-button--contained')).toBe(true);
      expect(pageButton(fixture, 4).classList.contains('atomic-button--outlined')).toBe(true);
    });
  });

  describe('two-way page binding', () => {
    @Component({
      imports: [AtomicPagination],
      template: `
        <app-atomic-pagination
          [page]="currentPage()"
          (pageChange)="currentPage.set($event)"
          [perPage]="10"
          [total]="100"
          [showLastButton]="true"
        ></app-atomic-pagination>
      `,
    })
    class HostComponent {
      currentPage = signal(5);
    }

    it('propagates page changes back to the parent', async () => {
      await TestBed.configureTestingModule({
        imports: [HostComponent],
        providers: [provideRouter([])],
      }).compileComponents();

      const fixture = TestBed.createComponent(HostComponent);
      fixture.detectChanges();

      navButton(fixture, 'last')!.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.currentPage()).toBe(10);
    });
  });
});
