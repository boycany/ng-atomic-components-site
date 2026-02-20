import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AtomicLink } from './shared/components/atomic-link/atomic-link';
import { AtomicButton } from './shared/components/atomic-button/atomic-button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AtomicLink, AtomicButton, MatDividerModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
