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

  protected readonly singleItem: BreadcrumbItem[] = [{ label: 'Home' }];

  protected readonly twoItems: BreadcrumbItem[] = [{ label: 'Home', to: '/' }, { label: 'About' }];

  homeIconTmpl = viewChild<TemplateRef<unknown>>('homeIconTmpl');
  productIconTmpl = viewChild<TemplateRef<unknown>>('productIconTmpl');
  electronicIconTmpl = viewChild<TemplateRef<unknown>>('electronicIconTmpl');
  computerIconTmpl = viewChild<TemplateRef<unknown>>('computerIconTmpl');
  laptopIconTmpl = viewChild<TemplateRef<unknown>>('laptopIconTmpl');
  laptopMacIconTmpl = viewChild<TemplateRef<unknown>>('laptopMacIconTmpl');
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

  protected readonly iconItems = computed<BreadcrumbItem[]>(() => {
    return [
      { label: 'Home', to: '/', iconTmpl: this.homeIconTmpl(), iconOnly: true },
      { label: 'Products', to: '/products', iconTmpl: this.productIconTmpl(), iconOnly: true },
      {
        label: 'Electronics',
        to: '/products/electronics',
        iconTmpl: this.electronicIconTmpl(),
        iconOnly: true,
      },
      {
        label: 'Computers',
        to: '/products/electronics/computers',
        iconTmpl: this.computerIconTmpl(),
        iconOnly: true,
      },
      {
        label: 'Laptops',
        to: '/products/electronics/computers/laptops',
        iconTmpl: this.laptopIconTmpl(),
        iconOnly: true,
      },
      { label: 'MacBook Pro', iconTmpl: this.laptopMacIconTmpl(), iconOnly: true },
    ];
  });

  protected readonly staticItems: BreadcrumbItem[] = [
    { label: 'Home' },
    { label: 'Category' },
    { label: 'Current Page' },
  ];
}
