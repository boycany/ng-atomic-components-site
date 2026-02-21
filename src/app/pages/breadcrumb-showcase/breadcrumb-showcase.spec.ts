import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbShowcase } from './breadcrumb-showcase';

describe('BreadcrumbShowcase', () => {
  let component: BreadcrumbShowcase;
  let fixture: ComponentFixture<BreadcrumbShowcase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbShowcase],
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbShowcase);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
