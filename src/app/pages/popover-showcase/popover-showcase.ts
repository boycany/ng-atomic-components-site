import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AtomicPopover } from '../../shared/components/atomic-popover/atomic-popover';
import { Placement, Side } from '../../shared/components/atomic-popover/atomic-popover-utils';
import { AtomicPopoverCdk } from '../../shared/components/atomic-popover-cdk/atomic-popover-cdk';

@Component({
  selector: 'app-popover-showcase',
  imports: [AtomicPopover, AtomicPopoverCdk],
  templateUrl: './popover-showcase.html',
  styleUrl: './popover-showcase.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverShowcase {
  protected readonly placements: (Side | Placement)[] = [
    'top',
    'top-start',
    'top-end',
    'bottom',
    'bottom-start',
    'bottom-end',
    'left',
    'left-start',
    'left-end',
    'right',
    'right-start',
    'right-end',
  ];
}
