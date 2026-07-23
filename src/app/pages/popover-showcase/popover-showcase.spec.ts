import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverShowcase } from './popover-showcase';

describe('PopoverShowcase', () => {
  let component: PopoverShowcase;
  let fixture: ComponentFixture<PopoverShowcase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopoverShowcase],
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverShowcase);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
