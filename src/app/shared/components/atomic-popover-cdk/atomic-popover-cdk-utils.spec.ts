import { ConnectedPosition } from '@angular/cdk/overlay';
import { Placement, Side } from '../atomic-popover/atomic-popover-utils';
import { toConnectedPositions } from './atomic-popover-cdk-utils';

describe('toConnectedPositions — 12 種 placement (offset 0)', () => {
  const cases: { placement: Side | Placement; primary: Partial<ConnectedPosition> }[] = [
    {
      placement: 'top',
      primary: { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom' },
    },
    {
      placement: 'top-start',
      primary: { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
    },
    {
      placement: 'top-end',
      primary: { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
    },
    {
      placement: 'bottom',
      primary: { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' },
    },
    {
      placement: 'bottom-start',
      primary: { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
    },
    {
      placement: 'bottom-end',
      primary: { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
    },
    {
      placement: 'left',
      primary: { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center' },
    },
    {
      placement: 'left-start',
      primary: { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top' },
    },
    {
      placement: 'left-end',
      primary: { originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'bottom' },
    },
    {
      placement: 'right',
      primary: { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center' },
    },
    {
      placement: 'right-start',
      primary: { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top' },
    },
    {
      placement: 'right-end',
      primary: { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'bottom' },
    },
  ];

  cases.forEach(({ placement, primary }) => {
    it(`${placement} → 主要 position 錨點正確`, () => {
      const [first] = toConnectedPositions(placement, 0);
      expect(first).toEqual(expect.objectContaining(primary));
    });
  });
});

describe('toConnectedPositions — 備援 position(flip)', () => {
  it('bottom 的備援是 top(相反 side,對齊軸不變)', () => {
    const [, fallback] = toConnectedPositions('bottom-start', 0);
    expect(fallback).toEqual(
      expect.objectContaining({
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom',
      })
    );
  });

  it('left 的備援是 right', () => {
    const [, fallback] = toConnectedPositions('left', 0);
    expect(fallback).toEqual(
      expect.objectContaining({
        originX: 'end',
        originY: 'center',
        overlayX: 'start',
        overlayY: 'center',
      })
    );
  });
});

describe('toConnectedPositions — offset', () => {
  it('數字 offset 套用到主軸:bottom 往下推 → offsetY 為正', () => {
    const [primary] = toConnectedPositions('bottom', 8);
    expect(primary.offsetY).toBe(8);
    expect(primary.offsetX).toBe(0);
  });

  it('數字 offset 套用到主軸:top 往上推 → offsetY 為負', () => {
    const [primary] = toConnectedPositions('top', 8);
    expect(primary.offsetY).toBe(-8);
  });

  it('數字 offset 套用到主軸:left 往左推 → offsetX 為負', () => {
    const [primary] = toConnectedPositions('left', 8);
    expect(primary.offsetX).toBe(-8);
  });

  it('數字 offset 套用到主軸:right 往右推 → offsetX 為正', () => {
    const [primary] = toConnectedPositions('right', 8);
    expect(primary.offsetX).toBe(8);
  });

  it('物件 offset 的 crossAxis 套用到對齊軸(top/bottom → offsetX)', () => {
    const [primary] = toConnectedPositions('bottom-start', { crossAxis: 20 });
    expect(primary.offsetX).toBe(20);
    expect(primary.offsetY).toBe(0);
  });

  it('物件 offset 的 crossAxis 套用到對齊軸(left/right → offsetY)', () => {
    const [primary] = toConnectedPositions('left-end', { crossAxis: 20 });
    expect(primary.offsetY).toBe(20);
    expect(primary.offsetX).toBe(0);
  });

  it('物件 offset 同時給 mainAxis 與 crossAxis', () => {
    const [primary] = toConnectedPositions('bottom-start', { mainAxis: 5, crossAxis: 20 });
    expect(primary.offsetY).toBe(5);
    expect(primary.offsetX).toBe(20);
  });
});
