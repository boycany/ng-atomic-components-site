import { Directive, input } from '@angular/core';

@Directive({
  selector: 'img[alt][appImageTooltip]',
  host: {
    '[attr.title]': 'alt()',
  },
})
export class ImageTooltip {
  alt = input.required<string>();
}
