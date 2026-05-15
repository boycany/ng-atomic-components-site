import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ImageTooltip } from './image-tooltip';

@Component({
  imports: [ImageTooltip],
  template: '<img appImageTooltip src="sample.jpg" alt="Tooltip from alt text" />',
})
class HostComponent {}

describe('ImageTooltip', () => {
  const setup = async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    const directive = fixture.debugElement.query(By.directive(ImageTooltip));

    return { directive, image };
  };

  it('should apply to images with appImageTooltip and alt', async () => {
    const { directive } = await setup();
    expect(directive).toBeTruthy();
  });

  it('should set the native title attribute from alt text', async () => {
    const { image } = await setup();
    expect(image.getAttribute('title')).toBe('Tooltip from alt text');
  });
});
