import { Directive, inject, TemplateRef } from '@angular/core';

export interface ItemTemplateContext {
  readonly $implicit: string;
}

@Directive({
  selector: '[appItemTemplate]',
})
export class ItemTemplateDirective {
  readonly template = inject(TemplateRef<ItemTemplateContext>);

  // It helps compiler to know the context type and avoid unknown, it doesn't execute in runtime
  static ngTemplateContextGuard(
    _: ItemTemplateDirective,
    ctx: unknown
  ): ctx is ItemTemplateContext {
    return true;
  }
}
