import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { COLOR_NAMES, FONT_NAMES, SIZES } from './selector-options';
import { ItemSelectorModule } from '../../shared/components/item-selector/item-selector';

@Component({
  selector: 'app-item-selector-showcase',
  imports: [ItemSelectorModule],
  templateUrl: './item-selector-showcase.html',
  styleUrl: './item-selector-showcase.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemSelectorShowcase {
  readonly possibleColors = signal(COLOR_NAMES);
  readonly possibleFonts = signal(FONT_NAMES);
  readonly possibleSizes = signal(SIZES);

  readonly selectedColor = signal(this.possibleColors()[0]);
  readonly selectedFont = signal(this.possibleFonts()[0]);
  readonly selectedSize = signal(this.possibleSizes()[0]);
}
