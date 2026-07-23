import { ConnectedPosition } from '@angular/cdk/overlay';
import {
  OffsetObject,
  Placement,
  resolveOffset,
  Side,
} from '../atomic-popover/atomic-popover-utils';

const OPPOSITE_SIDE: Record<Side, Side> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

function splitPlacement(placement: Side | Placement): {
  side: Side;
  alignment?: 'start' | 'end';
} {
  const [side, alignment] = placement.split('-') as [Side, 'start' | 'end' | undefined];
  return { side, alignment };
}

/**
 * 把 side/alignment + mainAxis/crossAxis 換算成 CDK 的 ConnectedPosition。
 * mainAxis 沿彈出方向轉成 offsetX 或 offsetY(依 side 而定),
 * crossAxis 沿對齊軸轉成另一個 offset——概念對應 atomic-popover-utils 的 computeCoords,
 * 差別是這裡只需給「錨點 + 位移」,實際座標運算交給 CDK 的 FlexibleConnectedPositionStrategy。
 */
// mainAxis 為 0 時 -mainAxis 會是 -0(IEEE754),用 || 0 收斂成一般的 0。
const negate = (n: number): number => -n || 0;

function toPosition(
  side: Side,
  alignment: 'start' | 'end' | undefined,
  mainAxis: number,
  crossAxis: number
): ConnectedPosition {
  if (side === 'top' || side === 'bottom') {
    const cross = alignment ?? 'center';
    return {
      originX: cross,
      originY: side,
      overlayX: cross,
      overlayY: side === 'top' ? 'bottom' : 'top',
      offsetY: side === 'top' ? negate(mainAxis) : mainAxis,
      offsetX: crossAxis,
    };
  }

  const cross = alignment === 'start' ? 'top' : alignment === 'end' ? 'bottom' : 'center';
  return {
    originX: side === 'left' ? 'start' : 'end',
    originY: cross,
    overlayX: side === 'left' ? 'end' : 'start',
    overlayY: cross,
    offsetX: side === 'left' ? negate(mainAxis) : mainAxis,
    offsetY: crossAxis,
  };
}

/**
 * 把 (placement, offset) 換成 CDK 用的 ConnectedPosition[]:
 * 第一筆是期望的 placement,第二筆是相反 side 的備援——
 * 當首選位置在視窗中放不下時,FlexibleConnectedPositionStrategy 會自動改用備援位置(flip)。
 * 這是手刻版「已知取捨」裡明確列為未處理的能力,交給 CDK 之後不用自己算。
 */
export function toConnectedPositions(
  placement: Side | Placement,
  offset: number | Partial<OffsetObject>
): ConnectedPosition[] {
  const { mainAxis, crossAxis } = resolveOffset(offset);
  const { side, alignment } = splitPlacement(placement);

  return [
    toPosition(side, alignment, mainAxis, crossAxis),
    toPosition(OPPOSITE_SIDE[side], alignment, mainAxis, crossAxis),
  ];
}
