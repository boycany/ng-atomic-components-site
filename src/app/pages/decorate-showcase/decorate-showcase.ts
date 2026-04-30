import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DecorateDirective } from '../../shared/directives/decorate/decorate';

@Component({
  selector: 'app-decorate-showcase',
  imports: [DecorateDirective],
  templateUrl: './decorate-showcase.html',
  styleUrl: './decorate-showcase.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DecorateShowcase {}
