import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AtomicLink } from './shared/components/atomic-link/atomic-link';
import { type LinkTo } from './shared/components/atomic-link/atomic-link.utils';
import { MatDividerModule } from '@angular/material/divider';

interface LinkItem {
  to: LinkTo;
  text: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AtomicLink, MatDividerModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly links: LinkItem[] = [
    { to: ['home'], text: 'Home' },
    { to: ['buttons'], text: 'Buttons' },
    {
      to: ['breadcrumbs'],
      text: 'Breadcrumbs',
    },
  ];
}
