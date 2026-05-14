import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Capitalize } from '../../shared/directives/capitalize/capitalize';

@Component({
  selector: 'app-capitalize-showcase',
  imports: [ReactiveFormsModule, Capitalize],
  templateUrl: './capitalize-showcase.html',
  styleUrl: './capitalize-showcase.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CapitalizeShowcase {
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected readonly form = this.formBuilder.group({
    fullName: ['ada lovelace'],
    jobTitle: ['principal frontend engineer'],
    city: ['taipei city'],
  });

  protected submittedValue = this.form.getRawValue();

  protected submitForm() {
    this.submittedValue = this.form.getRawValue();
  }
}
