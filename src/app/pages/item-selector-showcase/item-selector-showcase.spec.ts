import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSelectorShowcase } from './item-selector-showcase';

describe('ItemSelectorShowcase', () => {
  let component: ItemSelectorShowcase;
  let fixture: ComponentFixture<ItemSelectorShowcase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemSelectorShowcase],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemSelectorShowcase);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
