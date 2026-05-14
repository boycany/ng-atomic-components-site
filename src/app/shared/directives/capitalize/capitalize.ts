import { Directive, inject, Renderer2 } from '@angular/core';
import { capitalizeWords } from '../../helpers/capitalize-words/capitalize-words';

@Directive({
  selector: 'input[type="text"][appCapitalize]',
  host: {
    '(blur)': 'onBlur($event)',
  },
})
export class Capitalize {
  private renderer = inject(Renderer2);

  onBlur(event: FocusEvent) {
    const el = event.target as HTMLInputElement;
    const value = el.value;
    const fixedValue = capitalizeWords(value);

    if (fixedValue === value) {
      return;
    }

    this.renderer.setProperty(el, 'value', fixedValue);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
}
