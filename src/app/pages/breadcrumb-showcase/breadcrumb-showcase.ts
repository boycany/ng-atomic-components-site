import { Component } from '@angular/core';
import { AtomicBreadcrumb } from '../../shared/components/atomic-breadcrumb/atomic-breadcrumb';
import { BreadcrumbItem } from '../../shared/components/atomic-breadcrumb/atomic-breadcrumb.types';

@Component({
  selector: 'app-breadcrumb-showcase',
  imports: [AtomicBreadcrumb],
  templateUrl: './breadcrumb-showcase.html',
  styleUrl: './breadcrumb-showcase.scss',
})
export class BreadcrumbShowcase {
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', to: '/' },
    { label: 'Category', to: '/category' },
    { label: 'Sub-category', to: '/category/sub-category' },
    { label: 'Current Page' },
  ];

  breadcrumbItemsWithCustomSeparator: BreadcrumbItem[] = [
    { label: 'Home', to: '/' },
    { label: 'Category', to: '/category' },
    { label: 'Sub-category', to: '/category/sub-category' },
    { label: 'Current Page' },
  ];
  customSeparator = '>';
}
