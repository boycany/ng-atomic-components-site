import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  input,
  model,
} from '@angular/core';
import { ItemTemplateDirective } from './item-template.directive';
import { NgTemplateOutlet } from '@angular/common';

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
  private itemTempDirEff = effect(() => console.log(this.itemTemplate()));

  onSelect(option: string) {
    this.selectedOption.set(option);
  }
}

export const ItemSelectorModule = [ItemSelector, ItemTemplateDirective];
