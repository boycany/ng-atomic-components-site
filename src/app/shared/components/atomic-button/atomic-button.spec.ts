import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtomicButton } from './atomic-button';

describe('AtomicButton', () => {
  let component: AtomicButton;
  let fixture: ComponentFixture<AtomicButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtomicButton],
    }).compileComponents();

    fixture = TestBed.createComponent(AtomicButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
