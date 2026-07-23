import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import {
  OffsetObject,
  Placement,
  Side,
  toArray,
  Trigger,
} from '../atomic-popover/atomic-popover-utils';
import { toConnectedPositions } from './atomic-popover-cdk-utils';

@Component({
  selector: 'app-atomic-popover-cdk',
  imports: [OverlayModule],
  templateUrl: './atomic-popover-cdk.html',
  styleUrl: './atomic-popover-cdk.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomicPopoverCdk {
  // 與手刻版 AtomicPopover 相同的公開 API,方便兩者對照。
  modelValue = model<boolean>(false);

  trigger = input<Trigger | Trigger[]>('click');
  placement = input<Side | Placement>('bottom');
  offset = input<number | Partial<OffsetObject>>(8);

  // 取代手刻版的 computeCoords + referenceRect/popoverRect + effect:
  // 定位、量測、resize 重算、scroll 跟隨都交給 CDK 的 FlexibleConnectedPositionStrategy。
  protected positions = computed<ConnectedPosition[]>(() =>
    toConnectedPositions(this.placement(), this.offset())
  );

  protected onClick(): void {
    if (!toArray(this.trigger()).includes('click')) {
      return;
    }
    this.modelValue.set(!this.modelValue());
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (!toArray(this.trigger()).includes('click')) {
      return;
    }
    if ((event.target as HTMLElement).tagName === 'BUTTON') {
      return;
    }
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    event.preventDefault();
    this.modelValue.set(!this.modelValue());
  }

  protected onMouseenter(): void {
    if (!toArray(this.trigger()).includes('hover')) {
      return;
    }
    this.modelValue.set(true);
  }

  protected onMouseleave(): void {
    if (!toArray(this.trigger()).includes('hover')) {
      return;
    }
    this.modelValue.set(false);
  }

  protected onFocus(): void {
    if (!toArray(this.trigger()).includes('focus')) {
      return;
    }
    this.modelValue.set(true);
  }

  protected onBlur(): void {
    if (!toArray(this.trigger()).includes('focus')) {
      return;
    }
    this.modelValue.set(false);
  }

  protected onTouchstart(): void {
    if (!toArray(this.trigger()).includes('touch')) {
      return;
    }
    this.modelValue.set(true);
  }

  protected onTouchend(): void {
    if (!toArray(this.trigger()).includes('touch')) {
      return;
    }
    this.modelValue.set(false);
  }

  // cdkConnectedOverlay 的 overlayOutsideClick:CDK 已用 composedPath 判斷「是否落在
  // overlay pane 之外」,取代手刻版自己掛 document click + composedPath 的邏輯。
  protected onOutsideClick(): void {
    this.modelValue.set(false);
  }
}
