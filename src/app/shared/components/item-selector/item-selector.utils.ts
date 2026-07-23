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
): boolean {
  let nextFocus = traversalFn(container, currentFocus);
  while (nextFocus) {
    if (nextFocus.hasAttribute('tabindex')) {
      nextFocus.focus();
      return true;
    }
    nextFocus = traversalFn(container, nextFocus);
  }
  return false;
}
