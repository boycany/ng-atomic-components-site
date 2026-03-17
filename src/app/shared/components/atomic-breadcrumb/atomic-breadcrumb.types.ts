import { TemplateRef } from '@angular/core';
import { LinkTo } from '../atomic-link/atomic-link.utils';

export interface BreadcrumbItem {
  to?: LinkTo;
  label: string;
  iconTmpl?: TemplateRef<unknown>;
  iconOnly?: boolean;
}
