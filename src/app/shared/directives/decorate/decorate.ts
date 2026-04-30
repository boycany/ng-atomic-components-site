import { Directive } from '@angular/core';
import { HighlightDirective } from '../highlight/highlight';
import { UnderlineDirective } from '../underline/underline';

@Directive({
  selector: '[appDecorate]',
  hostDirectives: [
    UnderlineDirective,
    {
      directive: HighlightDirective,
      inputs: ['highlight: appDecorate'],
    },
  ],
})
export class DecorateDirective {}
