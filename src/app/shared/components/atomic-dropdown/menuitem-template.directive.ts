import { Directive, inject, TemplateRef } from '@angular/core';

export interface MenuitemTemplateContext {
  readonly $implicit: string;
  readonly label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly value: any;
  readonly disabled: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly context: any;
}

@Directive({
  selector: '[appMenuitemTemplate]',
})
export class MenuitemTemplateDirective {
  readonly template = inject(TemplateRef<MenuitemTemplateContext>);

  // It helps compiler to know the context type and avoid unknown, it doesn't execute in runtime
  static ngTemplateContextGuard(
    _: MenuitemTemplateDirective,
    ctx: unknown
  ): ctx is MenuitemTemplateContext {
    return true;
  }
}
