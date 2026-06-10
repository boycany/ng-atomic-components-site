import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-saveable-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <form class="saveable-form" [formGroup]="form" (ngSubmit)="save()">
      <mat-form-field>
        <mat-label>Name</mat-label>
        <input matInput formControlName="name" />
      </mat-form-field>
      <mat-form-field>
        <mat-label>Phone</mat-label>
        <input matInput formControlName="phone" />
      </mat-form-field>
      <div class="saveable-form__footer">
        @if (saved()) {
          <span class="saveable-form__status">Saved (read-only)</span>
          <button mat-button type="button" (click)="edit()">Edit</button>
        } @else {
          <button mat-flat-button type="submit">Save</button>
        }
        @if (hasUnsavedChanges()) {
          <span class="saveable-form__hint">Unsaved changes</span>
        }
      </div>
    </form>
  `,
  styles: `
    .saveable-form {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
      padding-top: 16px;
    }
    .saveable-form__footer {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .saveable-form__hint {
      color: var(--mat-sys-error, #b3261e);
      font-size: 0.875rem;
    }
    .saveable-form__status {
      font-size: 0.875rem;
      opacity: 0.7;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaveableForm {
  // 對應到 tab 的 value,讓父層守衛能用 e.from 找到正要離開的那份 form
  key = input.required<string>();

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    phone: new FormControl('', { nonNullable: true }),
  });

  saved = signal(false);
  private dirty = signal(false);
  // 上一次「確認過」的狀態快照;null = 從沒存過
  private savedValue = signal<{ name: string; phone: string } | null>(null);

  // 存過之後就沒有未存變更;只有「編輯過且尚未存」才算
  hasUnsavedChanges = computed(() => !this.saved() && this.dirty());

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.dirty.set(true));
  }

  save() {
    this.savedValue.set(this.form.getRawValue());
    this.saved.set(true);
    // disable 會讓表單變唯讀;emitEvent: false 避免又觸發 valueChanges 把 dirty 設回 true
    this.form.disable({ emitEvent: false });
  }

  edit() {
    this.saved.set(false);
    this.dirty.set(false);
    this.form.enable({ emitEvent: false });
  }

  // 放棄這次編輯,回到上一個確認過的狀態:存過 → 回到存檔的唯讀內容;沒存過 → 回到空白
  discard() {
    const baseline = this.savedValue();
    this.form.reset(baseline ?? { name: '', phone: '' }, { emitEvent: false });
    this.dirty.set(false);
    if (baseline) {
      this.saved.set(true);
      this.form.disable({ emitEvent: false });
    }
  }
}
