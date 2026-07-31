import { moveFocus, nextItem, previousItem } from './move-focus.helper';

const buildList = (count: number, focusable: boolean) => {
  const container = document.createElement('ul');
  for (let i = 0; i < count; i++) {
    const li = document.createElement('li');
    if (focusable) li.setAttribute('tabindex', i === 0 ? '0' : '-1');
    container.appendChild(li);
  }
  return { container, items: Array.from(container.children) as HTMLElement[] };
};

// 走訪函式會繞回頭,所以「找不到可聚焦元素」必須靠終止條件收斂。
// 注意:這幾個測試失敗時是「整個測試程序卡住」而非紅字 —— 同步無限迴圈會佔住
// event loop,vitest 的 per-test timeout 根本沒機會觸發,所以加 timeout 沒有用。
// 沒有這道保護,使用者在全部選項都停用的 menu 上按方向鍵就會卡死瀏覽器 ——
// 那是當機,不是功能缺陷,嚴重度完全不同。
describe('moveFocus 的終止保證', () => {
  it('所有項目都沒有 tabindex 時回傳 false,而不是無限迴圈', () => {
    const { container, items } = buildList(3, false);

    expect(moveFocus(container, items[0], nextItem)).toBe(false);
  });

  it('所有項目都被停用時回傳 false,而不是無限迴圈', () => {
    const { container, items } = buildList(3, true);
    items.forEach((item) => item.setAttribute('aria-disabled', 'true'));

    expect(moveFocus(container, items[0], nextItem)).toBe(false);
  });

  it('反向走訪同樣會結束', () => {
    const { container, items } = buildList(3, false);

    expect(moveFocus(container, items[0], previousItem)).toBe(false);
  });

  // currentFocus 是 document.activeElement,menu 剛開啟時它是外層的觸發元素,
  // 走訪會先在 container 外面繞再掉進來 —— 這條路徑最容易被漏掉。
  it('currentFocus 位於 container 之外時也會結束', () => {
    const outside = document.createElement('div');
    outside.innerHTML = '<span></span><span></span>';
    const { container } = buildList(3, false);

    expect(moveFocus(container, outside.firstElementChild as HTMLElement, nextItem)).toBe(false);
  });
});

// 終止保護不得改變原本就會成功的走訪。
describe('moveFocus 在可聚焦項目存在時的行為不變', () => {
  it('繞過頭仍能找到唯一可聚焦的項目', () => {
    const { container, items } = buildList(3, false);
    items[0].setAttribute('tabindex', '0');
    const focus = vi.spyOn(items[0], 'focus');

    // 從最後一個往後找,必須繞回開頭才會遇到 items[0]
    expect(moveFocus(container, items[2], nextItem)).toBe(true);
    expect(focus).toHaveBeenCalled();
  });

  it('跳過停用的項目,落在下一個可用的項目上', () => {
    const { container, items } = buildList(3, true);
    items[1].setAttribute('aria-disabled', 'true');
    const skipped = vi.spyOn(items[1], 'focus');
    const landed = vi.spyOn(items[2], 'focus');

    expect(moveFocus(container, items[0], nextItem)).toBe(true);
    expect(skipped).not.toHaveBeenCalled();
    expect(landed).toHaveBeenCalled();
  });

  it('container 沒有子元素時回傳 false', () => {
    const { container } = buildList(0, false);

    expect(moveFocus(container, null, nextItem)).toBe(false);
  });
});
