import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appItemTemplate]',
})
export class ItemTemplateDirective {
  readonly template = inject(TemplateRef);
}
