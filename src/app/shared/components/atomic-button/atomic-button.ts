import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { type ButtonColor, type ButtonVariant } from './atomic-button.types';
import { LinkTo } from '../atomic-link/atomic-link.utils';
import { AtomicLink } from '../atomic-link/atomic-link';

@Component({
  selector: 'app-atomic-button',
  imports: [AtomicLink],
  templateUrl: './atomic-button.html',
  styleUrl: './atomic-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomicButton {
  // button
  disabled = input<boolean>(false);
  type = input<'button' | 'submit' | 'reset'>('button');

  // link
  to = input<LinkTo>();
  linkLabel = input<string>();

  // style
  variant = input<ButtonVariant>('contained');
  color = input<ButtonColor>('primary');
  size = input<'normal' | 'small'>('normal');
  shape = input<'rectangle' | 'circle' | 'square'>('rectangle');

  BASIC_CLASS = 'atomic-button';
  rootClass = computed(() => {
    return [
      `${this.BASIC_CLASS}--${this.variant()}`,
      `${this.BASIC_CLASS}--${this.color()}`,
      `${this.BASIC_CLASS}--${this.shape()}`,
      `${this.BASIC_CLASS}--${this.size()}`,
    ];
  });
}
