import {
  ChangeDetectionStrategy,
  Component,
  computed,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { AtomicBreadcrumb } from '../../shared/components/atomic-breadcrumb/atomic-breadcrumb';
import { BreadcrumbItem } from '../../shared/components/atomic-breadcrumb/atomic-breadcrumb.types';
import { MatIconModule } from '@angular/material/icon';

interface SeparatorOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-breadcrumb-showcase',
  imports: [AtomicBreadcrumb, MatIconModule],
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

  protected homeIconTmpl = viewChild<TemplateRef<unknown>>('homeIconTmpl');
  protected productIconTmpl = viewChild<TemplateRef<unknown>>('productIconTmpl');
  protected electronicIconTmpl = viewChild<TemplateRef<unknown>>('electronicIconTmpl');
  protected computerIconTmpl = viewChild<TemplateRef<unknown>>('computerIconTmpl');
  protected laptopIconTmpl = viewChild<TemplateRef<unknown>>('laptopIconTmpl');
  protected laptopMacIconTmpl = viewChild<TemplateRef<unknown>>('laptopMacIconTmpl');
  protected readonly labelWithIconItems = computed<BreadcrumbItem[]>(() => {
    return [
      { label: 'Home', to: '/', iconTmpl: this.homeIconTmpl() },
      { label: 'Products', to: '/products', iconTmpl: this.productIconTmpl() },
      { label: 'Electronics', to: '/products/electronics', iconTmpl: this.electronicIconTmpl() },
      {
        label: 'Computers',
        to: '/products/electronics/computers',
        iconTmpl: this.computerIconTmpl(),
      },
      {
        label: 'Laptops',
        to: '/products/electronics/computers/laptops',
        iconTmpl: this.laptopIconTmpl(),
      },
      { label: 'MacBook Pro', iconTmpl: this.laptopMacIconTmpl() },
    ];
  });

  protected readonly iconItems = computed<BreadcrumbItem[]>(() =>
    this.labelWithIconItems().map((item) => ({ ...item, iconOnly: true }))
  );

  protected readonly staticItems: BreadcrumbItem[] = [
    { label: 'Home' },
    { label: 'Category' },
    { label: 'Current Page' },
  ];
}
