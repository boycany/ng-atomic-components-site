import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AtomicBreadcrumb } from '../../shared/components/atomic-breadcrumb/atomic-breadcrumb';
import { BreadcrumbItem } from '../../shared/components/atomic-breadcrumb/atomic-breadcrumb.types';

interface SeparatorOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-breadcrumb-showcase',
  imports: [AtomicBreadcrumb],
  templateUrl: './breadcrumb-showcase.html',
  styleUrl: './breadcrumb-showcase.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbShowcase {
  protected readonly basicItems: BreadcrumbItem[] = [
    { label: 'Home', to: '/' },
    { label: 'Category', to: '/category' },
    { label: 'Sub-category', to: '/category/sub-category' },
    { label: 'Current Page' },
  ];

  protected readonly stringSeparators: SeparatorOption[] = [
    { label: '>', value: '>' },
    { label: '»', value: '»' },
    { label: '•', value: '•' },
    { label: '|', value: '|' },
    { label: '→', value: '→' },
  ];

  protected readonly singleItem: BreadcrumbItem[] = [{ label: 'Home' }];

  protected readonly twoItems: BreadcrumbItem[] = [{ label: 'Home', to: '/' }, { label: 'About' }];

  protected readonly deepItems: BreadcrumbItem[] = [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/products' },
    { label: 'Electronics', to: '/products/electronics' },
    { label: 'Computers', to: '/products/electronics/computers' },
    { label: 'Laptops', to: '/products/electronics/computers/laptops' },
    { label: 'MacBook Pro' },
  ];

  protected readonly staticItems: BreadcrumbItem[] = [
    { label: 'Home' },
    { label: 'Category' },
    { label: 'Current Page' },
  ];
}
