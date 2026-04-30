import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackMouseShowcase } from './track-mouse-showcase';

describe('TrackMouseShowcase', () => {
  let component: TrackMouseShowcase;
  let fixture: ComponentFixture<TrackMouseShowcase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackMouseShowcase],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackMouseShowcase);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
