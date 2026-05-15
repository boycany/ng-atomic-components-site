import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ImageTooltip } from '../../shared/directives/image-tooltip/image-tooltip';
import { NgOptimizedImage } from '@angular/common';

interface TooltipImage {
  src: string;
  alt: string;
  caption: string;
}

@Component({
  selector: 'app-image-tooltip-showcase',
  imports: [ImageTooltip, NgOptimizedImage],
  templateUrl: './image-tooltip-showcase.html',
  styleUrl: './image-tooltip-showcase.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageTooltipShowcase {
  protected readonly images: TooltipImage[] = [
    {
      src: 'sample.jpg',
      alt: 'Sample image',
      caption: 'sample.jpg',
    },
    {
      src: 'sample2.jpg',
      alt: 'Second sample image',
      caption: 'sample2.jpg',
    },
  ];
}
