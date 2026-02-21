import { ChangeDetectionStrategy, Component, computed, input, Type } from '@angular/core';
import { BreadcrumbItem } from './atomic-breadcrumb.types';
import { AtomicLink } from '../atomic-link/atomic-link';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-atomic-breadcrumb',
  imports: [AtomicLink, NgComponentOutlet],
  templateUrl: './atomic-breadcrumb.html',
  styleUrl: './atomic-breadcrumb.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomicBreadcrumb {
  items = input.required<BreadcrumbItem[]>();
  separator = input<string | Type<unknown>>('/');
  strSeparator = computed<string | null>(() => {
    const separator = this.separator();
    return typeof separator === 'string' ? separator : null;
  });
  compSeparator = computed<Type<unknown> | null>(() => {
    const separator = this.separator();
    return typeof separator === 'string' ? null : separator;
  });
}
