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
}

export const ItemSelectorModule = [ItemSelector, ItemTemplateDirective, ItemContainerDirective];
