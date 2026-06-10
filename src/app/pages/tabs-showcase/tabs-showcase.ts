import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { Observable, map } from 'rxjs';
import { AtomicTabPanel } from '../../shared/components/atomic-tabs/atomic-tab-panel';
import {
  AtomicTabs,
  AtomicTabsChange,
  AtomicTabsItem,
} from '../../shared/components/atomic-tabs/atomic-tabs';
import { SaveableForm } from './saveable-form';

@Component({
  selector: 'app-tabs-showcase',
  imports: [
    AtomicTabs,
    AtomicTabPanel,
    SaveableForm,
    MatDividerModule,
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './tabs-showcase.html',
  styleUrl: './tabs-showcase.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsShowcase {
  private dialog = inject(MatDialog);

  items: AtomicTabsItem[] = [
    { value: 'tab1', label: 'Tab 1' },
    { value: 'tab2', label: 'Tab 2' },
    { value: 'tab3', label: 'Tab 3' },
    { value: 'tab4', label: 'Tab 4', disabled: true },
  ];

  selectedValue = signal('tab1');

  items2: AtomicTabsItem[] = [
    { value: 'form1', label: 'Form 1' },
    { value: 'form2', label: 'Form 2' },
    { value: 'form3', label: 'Form 3' },
  ];

  selectedValue2 = signal('form1');

  private forms = viewChildren(SaveableForm);
  private confirmDialog = viewChild.required<TemplateRef<unknown>>('confirmDialog');

  // 切走前檢查「正要離開的那個 tab」對應的 form 有沒有未存變更;有就跳 MatDialog 問
  // 選 Leave 代表放棄變更 → 把那份 form 還原到上一個確認過的狀態
  confirmLeave = (e: AtomicTabsChange): boolean | Observable<boolean> => {
    const leaving = this.forms().find((f) => f.key() === e.from);
    if (!leaving?.hasUnsavedChanges()) return true;
    return this.dialog
      .open(this.confirmDialog())
      .afterClosed()
      .pipe(
        map((confirmed) => {
          const leave = confirmed === true;
          if (leave) leaving.discard();
          return leave;
        })
      );
  };
}
