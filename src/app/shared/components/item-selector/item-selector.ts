import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  model,
} from '@angular/core';
import { ItemTemplateDirective } from './item-template.directive';
import { NgTemplateOutlet } from '@angular/common';
import { ItemContainerDirective } from './item-container.directive';
import { moveFocus, nextItem, previousItem } from './item-selector.utils';

@Component({
  selector: 'app-item-selector',
  imports: [NgTemplateOutlet],
  templateUrl: './item-selector.html',
  styleUrl: './item-selector.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemSelector {
  readonly title = input.required<string>();
  readonly options = input.required<string[]>();
  readonly selectedOption = model('');

  // Roving-tabindex target: falls back to the first option so the listbox
  // stays keyboard-reachable even before selectedOption has a valid value.
  readonly focusedOption = computed(() => {
    const options = this.options();
    const selected = this.selectedOption();
    return options.includes(selected) ? selected : options[0];
  });

  readonly itemTemplateDirective = contentChild(ItemTemplateDirective);
  readonly hasItemTemplate = computed(() => !!this.itemTemplateDirective());
  readonly itemTemplate = computed(() => this.itemTemplateDirective()?.template ?? null);

  readonly itemContainerDirective = contentChild(ItemContainerDirective);
  readonly hasItemContainerTemplate = computed(() => !!this.itemContainerDirective());
  readonly itemContainer = computed(() => this.itemContainerDirective()?.template ?? null);

  onSelect(option: string) {
    this.selectedOption.set(option);
  }

  makeOnSelect(option: string) {
    return () => this.onSelect(option);
  }

  onOptionsKeydown(event: KeyboardEvent) {
    const listbox = event.currentTarget as HTMLElement;
    const currentFocus = document.activeElement as HTMLElement;
    if (!listbox) return;

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        moveFocus(listbox, currentFocus, nextItem);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        moveFocus(listbox, currentFocus, previousItem);
        break;
      case 'Home':
        event.preventDefault();
        moveFocus(listbox, null, nextItem);
        break;
      case 'End':
        event.preventDefault();
        moveFocus(listbox, null, previousItem);
        break;
    }
  }
}

export const ItemSelectorModule = [ItemSelector, ItemTemplateDirective, ItemContainerDirective];
