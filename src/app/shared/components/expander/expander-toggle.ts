import { Directive, inject } from '@angular/core';
import { Expander } from './expander';

@Directive({
  selector: '[appExpanderToggle]',
  host: {
    '(click)': 'onClick()',
  },
})
export class ExpanderToggle {
  readonly expanderComponent = inject(Expander, {
    optional: true,
  }); // Add optional to prevent import this directive but not as the child element of expander

  onClick() {
    this.expanderComponent?.toggle();
  }
}
