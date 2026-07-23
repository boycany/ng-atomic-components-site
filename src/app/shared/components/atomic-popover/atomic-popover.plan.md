# AtomicPopover — 手刻實作筆記(Vue → Angular)

## Context

這份筆記把《為你寫的 Vue Components》第 7 章 `AtomicPopover` 的教學,翻譯成 Angular 21(signal、standalone、zoneless)的思考與實作。目標是**手刻**理解 popover 的定位數學與觸發機制;`@angular/cdk/overlay`(等同書本結尾的 Floating UI)刻意留到之後自行體會。

Popover 是 dropdown / tooltip / select 的底層元件,由兩部分組成:

- **Reference**:觸發彈出的元素(留在原地)。
- **Popover**:彈出的內容(需要浮在其他內容之上)。

## Vue → Angular 對照(核心心法)

| 書本 (Vue)                                                                         | 本專案 (Angular)                                                                                      |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `defineProps` + `withDefaults`                                                     | `input<T>(default)`                                                                                   |
| `defineEmits('update:modelValue')` + `computed({get,set})` 包 `modelValueWritable` | **`model<boolean>(false)` 一個搞定**,`this.modelValue.set(...)` 直接寫;書本的「基礎架構」小節整段消失 |
| `useTemplateRef('referenceRef')`                                                   | `viewChild.required<ElementRef>('reference')`                                                         |
| `computed(() => floatingStyles)`                                                   | `computed<Record<string,string>>(...)`,`[style]="floatingStyles()"`                                   |
| `watch([referenceRef, popoverRef], updateDOMRect)`                                 | `effect(() => this.updateRects())`(自動追蹤讀到的 viewChild signal)                                   |
| `onMounted` 掛 listener / `onUnmounted` 移除                                       | `fromEvent(...).pipe(takeUntilDestroyed())`(掛載與清理綁一起)                                         |
| `<slot name="reference">` / `<slot name="default">`                                | `<ng-content select="[trigger]">` / `<ng-content />`                                                  |
| `<Teleport to="body">`                                                             | **CDK Overlay / Portal(本次略,之後補)**                                                               |

> 關鍵差異:`<ng-content>` 是「定位式投影」,搬不走。真正要把內容 teleport 到 body、避免被 `overflow` 裁切,才需要 CDK Overlay——這正好對應書本最後才登場的 Floating UI。

## 檔案

- `atomic-popover.ts` — 元件:`model`/`input`、`viewChild`、`floatingStyles` computed、`updateRects`、resize 與 click-outside 監聽、8 個 trigger handler。
- `atomic-popover.html` — reference `<span>`(role=button / tabindex / aria-expanded / 事件)+ `@if (modelValue())` 的 popover 內容區。
- `atomic-popover-utils.ts` — 純函式與型別(遵本專案「邏輯抽到 utils」慣例):
  - `computeCoords(placement, ref, pop, offset)` — 12 種 placement 定位公式(書本圖 7-6 ~ 7-12)。
  - `resolveOffset` — 數字 → `mainAxis`;物件 → `{mainAxis:0, crossAxis:0, ...offset}`。
  - `toArray` / `isNumber` / `parseDOMRect` / 型別 `Trigger`/`Side`/`Placement`/`OffsetObject`/`DomRectLike`。
- `atomic-popover.scss` — reference 的 focus-visible 樣式與 popover `z-index`(最小化)。
- `atomic-popover-utils.spec.ts` / `atomic-popover.spec.ts` — 測試。

## 定位數學(computeCoords)

- **主軸 mainAxis**:沿彈出方向把 popover 推離 reference(`bottom` 為 `+`、`top`/`left` 為 `-`)。
- **交錯軸 crossAxis**:沿垂直方向做 start / center / end 對齊的錯位。
- 座標為視窗座標;`floatingStyles` 再 `+= window.scrollX/Y` 換算成文件座標,並用 `transform: translate(...)` 定位(避免 Reflow,只觸發 Compositing)。

## Trigger 事件(對照書本)

每個 handler 都先 `toArray(this.trigger()).includes(...)` 守衛:

- `click` → `onClick`(切換)+ `onKeydown`(Enter/Space;target 為原生 `<button>` 時交給原生)。
- `hover` → `onMouseenter`(開)/ `onMouseleave`(關)。
- `focus` → `onFocus`(開)/ `onBlur`(關)。
- `touch` → `onTouchstart`(開)/ `onTouchend`(關)。

click-outside:`document` click + `event.composedPath()` 判斷點擊是否落在 reference / popover 內。

## 已知取捨(留給 CDK 階段)

- **沒有 teleport**:popover 目前渲染在元件 DOM 內。`position: absolute` + scroll 位移在「祖先沒有 positioned / transform」時正確;一旦被裁切或定位錯亂,就是導入 CDK Overlay 的時機。
- **未處理**:超出視窗自動翻轉(flip)、箭頭、focus trap / Esc 關閉、`aria-haspopup` 等——CDK 或後續 a11y 強化再補。

## 驗證

```bash
npm run test:ci      # 全部單元測試(含 popover 的 utils 與元件測試)
npm run lint
npm run check        # Prettier
```

已驗證:lint 通過、Prettier 通過、單元測試全數通過,`atomic-popover/` 覆蓋率 99% statements / 90% branches / 100% lines(高於 95/80 門檻)。

```bash
npm start            # 之後可建 popover-showcase 頁手動驗證定位與觸發
```
