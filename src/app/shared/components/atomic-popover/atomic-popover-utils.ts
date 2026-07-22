export type Trigger = 'click' | 'hover' | 'focus' | 'touch';
export type Side = 'top' | 'right' | 'bottom' | 'left';
export type Alignment = 'start' | 'end';
export type Placement = `${Side}-${Alignment}`;

export interface OffsetObject {
  mainAxis: number;
  crossAxis: number;
}

export interface DomRectLike {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
  x: number;
  y: number;
}

/**
 * 讀取元素在視窗中的位置與大小。
 * 書本用 getBoundingClientRect().toJSON(),這裡改成手動取值:回傳型別明確,
 * 也不依賴環境是否實作 DOMRect.toJSON(方便在 jsdom 中測試)。
 */
export function parseDOMRect(node: HTMLElement): DomRectLike {
  const rect = node.getBoundingClientRect();
  return {
    bottom: rect.bottom,
    height: rect.height,
    left: rect.left,
    right: rect.right,
    top: rect.top,
    width: rect.width,
    x: rect.x,
    y: rect.y,
  };
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

/** 把「單一值或陣列」統一成陣列,方便用 includes 判斷。 */
export function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

/**
 * 把 offset 設定正規化成 { mainAxis, crossAxis }。
 * - 數字:視為主軸偏移(mainAxis),交錯軸為 0
 * - 物件:主軸/交錯軸預設 0,再以傳入的值覆寫
 */
export function resolveOffset(offset: number | Partial<OffsetObject>): OffsetObject {
  if (isNumber(offset)) {
    return { mainAxis: offset, crossAxis: 0 };
  }
  return { mainAxis: 0, crossAxis: 0, ...offset };
}

/**
 * 依 placement 算出 popover 左上角應該落在的座標(視窗座標系)。
 * - mainAxis:沿「彈出方向」把 popover 推離 reference
 * - crossAxis:沿「垂直於彈出方向」的軸做錯位對齊
 * 共 12 種組合,公式對應書本圖 7-6 ~ 7-12。
 */
export function computeCoords(
  placement: Side | Placement,
  reference: DomRectLike,
  popover: DomRectLike,
  offset: number | Partial<OffsetObject>
): { x: number; y: number } {
  const { mainAxis, crossAxis } = resolveOffset(offset);

  switch (placement) {
    case 'top':
      return {
        x: reference.left + reference.width / 2 - popover.width / 2 + crossAxis,
        y: reference.top - popover.height - mainAxis,
      };
    case 'top-start':
      return {
        x: reference.left + crossAxis,
        y: reference.top - popover.height - mainAxis,
      };
    case 'top-end':
      return {
        x: reference.right - popover.width + crossAxis,
        y: reference.top - popover.height - mainAxis,
      };
    case 'bottom':
      return {
        x: reference.left + reference.width / 2 - popover.width / 2 + crossAxis,
        y: reference.bottom + mainAxis,
      };
    case 'bottom-start':
      return {
        x: reference.left + crossAxis,
        y: reference.bottom + mainAxis,
      };
    case 'bottom-end':
      return {
        x: reference.right - popover.width + crossAxis,
        y: reference.bottom + mainAxis,
      };
    case 'left':
      return {
        x: reference.left - popover.width - mainAxis,
        y: reference.top + reference.height / 2 - popover.height / 2 + crossAxis,
      };
    case 'left-start':
      return {
        x: reference.left - popover.width - mainAxis,
        y: reference.top + crossAxis,
      };
    case 'left-end':
      return {
        x: reference.left - popover.width - mainAxis,
        y: reference.bottom - popover.height + crossAxis,
      };
    case 'right':
      return {
        x: reference.right + mainAxis,
        y: reference.top + reference.height / 2 - popover.height / 2 + crossAxis,
      };
    case 'right-start':
      return {
        x: reference.right + mainAxis,
        y: reference.top + crossAxis,
      };
    case 'right-end':
      return {
        x: reference.right + mainAxis,
        y: reference.bottom - popover.height + crossAxis,
      };
    default:
      // 只給 Side(top/right/bottom/left)時已在上面處理;此處為型別保險
      return { x: reference.left, y: reference.bottom };
  }
}
