import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { AtomicButton } from '../atomic-button/atomic-button';
import { MatIconModule } from '@angular/material/icon';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-atomic-pagination',
  imports: [AtomicButton, MatIconModule, NgTemplateOutlet],
  templateUrl: './atomic-pagination.html',
  styleUrl: './atomic-pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomicPagination {
  page = model.required<number>();
  // pageEff = effect(() => console.log('currentPage: >> ', this.page()));
  perPage = input.required<number>();
  total = input.required<number>();

  count = computed(() => Math.ceil(this.total() / this.perPage()));
  pageNumbers = computed(() => Array.from({ length: this.count() }, (_, i) => i + 1));
  // countEff = effect(() => console.log('count: >> ', this.count()));
  // pageNumbersEff = effect(() => console.log('pageNumbers: >> ', this.pageNumbers()));

  boundaryCount = input<number>(1);
  siblingCount = input<number>(1);

  startPages = computed(() => this.createRange(1, Math.min(this.count(), this.boundaryCount())));
  endPages = computed(() =>
    this.createRange(
      Math.max(this.count() - this.boundaryCount() + 1, this.boundaryCount() + 1),
      this.count()
    )
  );
  // First page number of the sliding window around the current page.
  // - `page - siblingCount` is the natural left edge.
  // - inner Math.min caps it near the end so the window keeps a fixed width
  //   instead of shrinking (the cap lands the window's right edge on the last
  //   page before the end boundary).
  // - outer Math.max keeps it from overlapping the start boundary pages.
  siblingStart = computed(() =>
    Math.max(
      Math.min(
        this.page() - this.siblingCount(),
        this.count() - this.boundaryCount() - this.siblingCount() * 2
      ),
      this.boundaryCount() + 1
    )
  );
  // siblingStartEff = effect(() => console.log('siblingStart: ', this.siblingStart()));

  // Last page number of the sliding window — mirror of siblingStart.
  // - `page + siblingCount` is the natural right edge.
  // - inner Math.max props the window up near the start so it keeps a fixed
  //   width (the floor lands the window's left edge right after the start
  //   boundary).
  // - outer Math.min keeps it from overlapping the end boundary pages.
  siblingEnd = computed(() =>
    Math.min(
      Math.max(
        this.page() + this.siblingCount(),
        this.boundaryCount() + this.siblingCount() * 2 + 1
      ),
      this.count() - this.boundaryCount()
    )
  );
  // siblingEndEff = effect(() => console.log('siblingEnd: ', this.siblingEnd()));
  siblingPages = computed(() => this.createRange(this.siblingStart(), this.siblingEnd()));

  // Show an ellipsis when there is a gap between a boundary block and the
  // sibling window. The reference values are the boundary edges, not the
  // start/end page arrays: `boundaryCount + 1` is the first page after the
  // start boundary, and `count - boundaryCount` is the last page before the
  // end boundary (i.e. the page just before the first endPage). Using the
  // array lengths breaks when a block is empty (e.g. count === 1, where
  // endPages is []), which previously rendered a stray end ellipsis.
  needStartEllipsis = computed(() => this.siblingStart() > this.boundaryCount() + 1);
  needEndEllipsis = computed(() => this.siblingEnd() < this.count() - this.boundaryCount());
  // needStartEff = effect(() => console.log('needStartEllipsis: ', this.needStartEllipsis()));
  // needEndEff = effect(() => console.log('needEndEllipsis: ', this.needEndEllipsis()));

  hidePrevButton = input<boolean>(false);
  hideNextButton = input<boolean>(false);
  showFirstButton = input<boolean>(false);
  showLastButton = input<boolean>(false);
  disabled = input<boolean>(false);

  updatePage(page: number) {
    if (page <= 0 || page > this.count()) return;
    this.page.set(page);
  }

  createRange(start: number, end: number) {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
}
