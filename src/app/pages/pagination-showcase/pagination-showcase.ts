import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AtomicPagination } from '../../shared/components/atomic-pagination/atomic-pagination';

@Component({
  selector: 'app-pagination-showcase',
  imports: [AtomicPagination],
  templateUrl: './pagination-showcase.html',
  styleUrl: './pagination-showcase.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationShowcase {}
