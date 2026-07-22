import {
  computeCoords,
  DomRectLike,
  isNumber,
  Placement,
  resolveOffset,
  Side,
  toArray,
} from './atomic-popover-utils';

// reference 位於視窗 (100,100),寬 100 高 40 → right=200, bottom=140
const reference: DomRectLike = {
  left: 100,
  top: 100,
  right: 200,
  bottom: 140,
  width: 100,
  height: 40,
  x: 100,
  y: 100,
};
// popover 寬 60 高 20
const popover: DomRectLike = {
  left: 0,
  top: 0,
  right: 60,
  bottom: 20,
  width: 60,
  height: 20,
  x: 0,
  y: 0,
};

describe('computeCoords — 12 種 placement (offset 0)', () => {
  const cases: { placement: Side | Placement; x: number; y: number }[] = [
    { placement: 'top', x: 120, y: 80 },
    { placement: 'top-start', x: 100, y: 80 },
    { placement: 'top-end', x: 140, y: 80 },
    { placement: 'bottom', x: 120, y: 140 },
    { placement: 'bottom-start', x: 100, y: 140 },
    { placement: 'bottom-end', x: 140, y: 140 },
    { placement: 'left', x: 40, y: 110 },
    { placement: 'left-start', x: 40, y: 100 },
    { placement: 'left-end', x: 40, y: 120 },
    { placement: 'right', x: 200, y: 110 },
    { placement: 'right-start', x: 200, y: 100 },
    { placement: 'right-end', x: 200, y: 120 },
  ];

  cases.forEach(({ placement, x, y }) => {
    it(`${placement} → (${x}, ${y})`, () => {
      expect(computeCoords(placement, reference, popover, 0)).toEqual({ x, y });
    });
  });
});

describe('computeCoords — offset', () => {
  it('數字 offset 套用到主軸(bottom 往下推)', () => {
    expect(computeCoords('bottom-start', reference, popover, 8)).toEqual({ x: 100, y: 148 });
  });

  it('數字 offset 套用到主軸(left 往左推)', () => {
    // x: 100 - 60 - 8 = 32
    expect(computeCoords('left', reference, popover, 8)).toEqual({ x: 32, y: 110 });
  });

  it('物件 offset 只給 crossAxis 時做錯位', () => {
    expect(computeCoords('bottom-start', reference, popover, { crossAxis: 20 })).toEqual({
      x: 120,
      y: 140,
    });
  });

  it('物件 offset 同時給 mainAxis 與 crossAxis', () => {
    expect(
      computeCoords('bottom-start', reference, popover, { mainAxis: 5, crossAxis: 20 })
    ).toEqual({ x: 120, y: 145 });
  });
});

describe('computeCoords — 型別保險', () => {
  it('非預期的 placement 落到 default(bottom-start 位置)', () => {
    expect(computeCoords('unknown' as Side, reference, popover, 0)).toEqual({ x: 100, y: 140 });
  });
});

describe('resolveOffset', () => {
  it('數字 → mainAxis,crossAxis 為 0', () => {
    expect(resolveOffset(8)).toEqual({ mainAxis: 8, crossAxis: 0 });
  });

  it('部分物件 → 未給的軸預設為 0', () => {
    expect(resolveOffset({ mainAxis: 3 })).toEqual({ mainAxis: 3, crossAxis: 0 });
    expect(resolveOffset({ crossAxis: 5 })).toEqual({ mainAxis: 0, crossAxis: 5 });
  });
});

describe('isNumber / toArray', () => {
  it('isNumber 只對數字回傳 true', () => {
    expect(isNumber(0)).toBe(true);
    expect(isNumber('8')).toBe(false);
    expect(isNumber({ mainAxis: 1 })).toBe(false);
  });

  it('toArray 把單一值包成陣列、陣列原樣回傳', () => {
    expect(toArray('click')).toEqual(['click']);
    expect(toArray(['click', 'hover'])).toEqual(['click', 'hover']);
  });
});
