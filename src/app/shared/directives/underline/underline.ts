import { Directive } from '@angular/core';

@Directive({
  selector: '[appUnderline]',
  host: {
    '[style.text-decoration]': '"underline"',
  },
})
export class UnderlineDirective {}
