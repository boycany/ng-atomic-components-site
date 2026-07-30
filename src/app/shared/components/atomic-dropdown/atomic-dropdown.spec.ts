import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtomicDropdown } from './atomic-dropdown';

describe('AtomicDropdown', () => {
  let component: AtomicDropdown;
  let fixture: ComponentFixture<AtomicDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtomicDropdown],
    }).compileComponents();

    fixture = TestBed.createComponent(AtomicDropdown);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
