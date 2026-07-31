export function nextItem(container: HTMLElement, item: HTMLElement | null): HTMLElement | null {
  if (item && item.nextElementSibling) {
    return item.nextElementSibling as HTMLElement;
  }
  return container.firstElementChild as HTMLElement | null;
}

export function previousItem(container: HTMLElement, item: HTMLElement | null): HTMLElement | null {
  if (item && item.previousElementSibling) {
    return item.previousElementSibling as HTMLElement;
  }
  return container.lastElementChild as HTMLElement | null;
}

type TraversalFunction = (
  container: HTMLElement,
  currentFocus: HTMLElement | null
) => HTMLElement | null;

export function moveFocus(
  container: HTMLElement,
  currentFocus: HTMLElement | null,
  traversalFn: TraversalFunction
) {
  // nextItem/previousItem 走到盡頭會繞回頭,且不保證停在 container 內,
  // 所以沒有任何可聚焦元素時走訪會無限循環。記錄拜訪過的元素當作終止條件:
  // 凡是原本就會正常結束的走訪都不可能重複拜訪,因此行為不變。
  const visited = new Set<HTMLElement>();
  let nextFocus = traversalFn(container, currentFocus);

  while (nextFocus && !visited.has(nextFocus)) {
    visited.add(nextFocus);

    const nextFocusDisabled =
      (nextFocus as HTMLButtonElement).disabled ||
      nextFocus.getAttribute('aria-disabled') === 'true';

    if (!nextFocus.hasAttribute('tabindex') || nextFocusDisabled) {
      nextFocus = traversalFn(container, nextFocus);
    } else {
      nextFocus.focus();
      return true;
    }
  }
  return false;
}
