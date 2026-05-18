import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Icon } from './icon';
import { ICONS, KnownIcon, UNKNOWN_ICON } from './icons';

describe('Icon', () => {
  let component: Icon;
  let fixture: ComponentFixture<Icon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Icon],
    }).compileComponents();

    fixture = TestBed.createComponent(Icon);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('name', 'projection');
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should render the registered svg path for the requested icon', () => {
    fixture.componentRef.setInput('name', 'projection');
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg') as SVGElement;
    const path = fixture.nativeElement.querySelector('path') as SVGPathElement;

    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(path.getAttribute('d')).toBe(ICONS.projection);
  });

  it('should update the rendered path when the icon name changes', () => {
    fixture.componentRef.setInput('name', 'projection');
    fixture.detectChanges();

    fixture.componentRef.setInput('name', 'cogwheel');
    fixture.detectChanges();

    const path = fixture.nativeElement.querySelector('path') as SVGPathElement;
    expect(path.getAttribute('d')).toBe(ICONS.cogwheel);
  });

  it('should render the unknown icon path when the name is not registered', () => {
    fixture.componentRef.setInput('name', 'missing-icon' as KnownIcon);
    fixture.detectChanges();

    const path = fixture.nativeElement.querySelector('path') as SVGPathElement;
    expect(path.getAttribute('d')).toBe(UNKNOWN_ICON);
  });
});
