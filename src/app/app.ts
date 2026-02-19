import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AtomicLink } from './shared/components/atomic-link/atomic-link';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AtomicLink],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
