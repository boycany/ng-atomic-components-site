import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ImageTooltip } from '../../shared/directives/image-tooltip/image-tooltip';
import { ImageTooltipShowcase } from './image-tooltip-showcase';

const setup = async () => {
  await TestBed.configureTestingModule({
    imports: [ImageTooltipShowcase],
  }).compileComponents();

  const fixture = TestBed.createComponent(ImageTooltipShowcase);
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();

  return { fixture, component: fixture.componentInstance };
};

describe('ImageTooltipShowcase', () => {
  let component: ImageTooltipShowcase;
  let fixture: ComponentFixture<ImageTooltipShowcase>;

  beforeEach(async () => {
    ({ component, fixture } = await setup());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the page title', () => {
    const h1 = fixture.debugElement.query(By.css('h1'));
    expect(h1.nativeElement.textContent).toBe('Image Tooltip Directive');
  });

  it('should apply appImageTooltip to each image', () => {
    const tooltipImages = fixture.debugElement.queryAll(By.directive(ImageTooltip));
    expect(tooltipImages.length).toBe(2);
  });

  it('should render both sample images', () => {
    const images = Array.from(fixture.nativeElement.querySelectorAll('img')) as HTMLImageElement[];
    expect(images.map((image) => image.getAttribute('src'))).toEqual(['sample.jpg', 'sample2.jpg']);
  });

  it('should set native title text from alt text', () => {
    const images = Array.from(fixture.nativeElement.querySelectorAll('img')) as HTMLImageElement[];

    expect(images[0].getAttribute('title')).toBe('Sample image');
    expect(images[1].getAttribute('title')).toBe('Second sample image');
  });
});
