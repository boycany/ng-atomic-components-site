import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationShowcase } from './pagination-showcase';

describe('PaginationShowcase', () => {
  let component: PaginationShowcase;
  let fixture: ComponentFixture<PaginationShowcase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationShowcase],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationShowcase);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
