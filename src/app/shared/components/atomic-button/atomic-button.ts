import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { type ButtonColor, type ButtonVariant } from './atomic-button.types';

@Component({
  selector: 'app-atomic-button',
  imports: [],
  templateUrl: './atomic-button.html',
  styleUrl: './atomic-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomicButton {
  disabled = input<boolean>(false);
  type = input<'button' | 'submit' | 'reset'>('button');

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
