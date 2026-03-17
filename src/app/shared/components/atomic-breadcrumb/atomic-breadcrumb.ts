import { ChangeDetectionStrategy, Component, computed, input, Type } from '@angular/core';
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { BreadcrumbItem } from './atomic-breadcrumb.types';
import { AtomicLink } from '../atomic-link/atomic-link';

@Component({
  selector: 'app-atomic-breadcrumb',
  imports: [NgTemplateOutlet, NgComponentOutlet, AtomicLink],
  templateUrl: './atomic-breadcrumb.html',
  styleUrl: './atomic-breadcrumb.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomicBreadcrumb {
  items = input.required<BreadcrumbItem[]>();
  separator = input<string | Type<unknown>>('/');
  protected readonly strSeparator = computed<string | null>(() => {
    const separator = this.separator();
    return typeof separator === 'string' ? separator : null;
  });
  protected readonly compSeparator = computed<Type<unknown> | null>(() => {
    const separator = this.separator();
    return typeof separator === 'string' ? null : separator;
  });
}
