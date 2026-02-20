import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AtomicButton } from '../../shared/components/atomic-button/atomic-button';
import {
  type ButtonColor,
  type ButtonVariant,
} from '../../shared/components/atomic-button/atomic-button.types';

interface ButtonGroup {
  label: string;
  color: ButtonColor;
}

interface VariantItem {
  variant: ButtonVariant;
  label: string;
}

@Component({
  selector: 'app-buttons-showcase',
  imports: [AtomicButton, MatIconModule],
  templateUrl: './buttons-showcase.html',
  styleUrl: './buttons-showcase.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonsShowcase {
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
