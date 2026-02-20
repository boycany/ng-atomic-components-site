import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AtomicButton } from './shared/components/atomic-button/atomic-button';
import {
  type ButtonColor,
  type ButtonVariant,
} from './shared/components/atomic-button/atomic-button.types';
import { AtomicLink } from './shared/components/atomic-link/atomic-link';
import { type LinkTo } from './shared/components/atomic-link/atomic-link.utils';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

interface LinkItem {
  to: LinkTo;
  text: string;
}

interface ButtonGroup {
  label: string;
  color: ButtonColor;
}

interface VariantItem {
  variant: ButtonVariant;
  label: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AtomicLink, AtomicButton, MatDividerModule, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly links: LinkItem[] = [
    { to: ['home'], text: 'Home' },
    { to: ['feature'], text: 'Feature' },
  ];

  protected readonly buttonGroups: ButtonGroup[] = [
    { label: 'Primary', color: 'primary' },
    { label: 'Success', color: 'success' },
    { label: 'Warn', color: 'warn' },
    { label: 'Danger', color: 'danger' },
    { label: 'Secondary', color: 'secondary' },
  ];

  protected readonly variantItems: VariantItem[] = [
    { variant: 'contained', label: 'Contained Button' },
    { variant: 'outlined', label: 'Outlined Button' },
    { variant: 'text', label: 'Text Button' },
  ];
}
