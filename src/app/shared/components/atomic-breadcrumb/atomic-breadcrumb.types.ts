import { LinkTo } from '../atomic-link/atomic-link.utils';

export interface BreadcrumbItem {
  to?: LinkTo;
  label: string;
}
