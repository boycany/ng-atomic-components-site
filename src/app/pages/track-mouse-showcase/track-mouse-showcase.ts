import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TrackMouseDirective } from '../../shared/directives/track-mouse/track-mouse';

@Component({
  selector: 'app-track-mouse-showcase',
  imports: [TrackMouseDirective],
  templateUrl: './track-mouse-showcase.html',
  styleUrl: './track-mouse-showcase.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackMouseShowcase {}
