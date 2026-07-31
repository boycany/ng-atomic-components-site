import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownShowcase } from './dropdown-showcase';

describe('DropdownShowcase', () => {
  let component: DropdownShowcase;
  let fixture: ComponentFixture<DropdownShowcase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownShowcase],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownShowcase);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
