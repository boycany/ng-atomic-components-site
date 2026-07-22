import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import {
  computeCoords,
  DomRectLike,
  OffsetObject,
  parseDOMRect,
  Placement,
  Side,
  toArray,
  Trigger,
} from './atomic-popover-utils';

@Component({
  selector: 'app-atomic-popover',
  imports: [],
  templateUrl: './atomic-popover.html',
  styleUrl: './atomic-popover.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomicPopover {
  // 顯示狀態:等於 Vue 的 v-model / modelValue + update:modelValue,一個 model() 全包。
  modelValue = model<boolean>(false);

  // 設定
  trigger = input<Trigger | Trigger[]>('click');
  placement = input<Side | Placement>('bottom');
  offset = input<number | Partial<OffsetObject>>(8);

  // DOM 參照(等同 Vue 的 useTemplateRef)
  reference = viewChild.required<ElementRef<HTMLElement>>('reference');
  popover = viewChild<ElementRef<HTMLElement>>('popover');

  private referenceRect = signal<DomRectLike | null>(null);
  private popoverRect = signal<DomRectLike | null>(null);

  protected floatingStyles = computed<Record<string, string>>(() => {
    const ref = this.referenceRect();
    const pop = this.popoverRect();

    if (!ref || !pop) {
      return { position: 'absolute' };
    }

    const coords = computeCoords(this.placement(), ref, pop, this.offset());
    // getBoundingClientRect 是視窗座標,加上捲動距離換算成文件座標。
    coords.x += window.scrollX;
    coords.y += window.scrollY;

    const styles: Record<string, string> = {
      position: 'absolute',
      top: '0',
      left: '0',
      transform: `translate(${coords.x}px, ${coords.y}px)`, // 用 transform 避免 Reflow
    };
    return styles;
  });

  constructor() {
    const destroyRef = inject(DestroyRef);

    // popover 出現、或 reference 變動時重新量測。
    // 等同 Vue 的 watch([referenceRef, popoverRef], updateDOMRect):
    // effect 會自動追蹤讀到的 viewChild signal,popover() 由 undefined→有值時重跑。
    effect(() => this.updateRects());

    // 視窗縮放時重新量測(等同 onMounted 掛 resize、onUnmounted 移除,
    // takeUntilDestroyed 讓「掛載」與「清理」綁在一起,不會忘記移除)。
    fromEvent(window, 'resize')
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe(() => this.updateRects());

    // 點擊 popover 外部時關閉。
    fromEvent<MouseEvent>(document, 'click')
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe((event) => this.onClickOutside(event));
  }

  private updateRects(): void {
    const pop = this.popover();
    if (!pop) {
      return;
    }
    this.referenceRect.set(parseDOMRect(this.reference().nativeElement));
    this.popoverRect.set(parseDOMRect(pop.nativeElement));
  }

  private onClickOutside(event: MouseEvent): void {
    if (!this.modelValue()) {
      return;
    }
    const path = event.composedPath();
    const reference = this.reference().nativeElement;
    const popover = this.popover()?.nativeElement;
    if (path.includes(reference) || (popover && path.includes(popover))) {
      return;
    }
    this.modelValue.set(false);
  }

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
    // 投影進來的 <button> 由原生鍵盤語意處理,避免重複觸發。
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
}
