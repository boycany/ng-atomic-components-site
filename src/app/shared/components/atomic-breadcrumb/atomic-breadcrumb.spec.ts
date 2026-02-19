import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtomicBreadcrumb } from './atomic-breadcrumb';

describe('AtomicBreadcrumb', () => {
  let component: AtomicBreadcrumb;
  let fixture: ComponentFixture<AtomicBreadcrumb>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtomicBreadcrumb],
    }).compileComponents();

    fixture = TestBed.createComponent(AtomicBreadcrumb);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
