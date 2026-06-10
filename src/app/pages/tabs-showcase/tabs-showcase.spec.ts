import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom, Observable } from 'rxjs';

import { SaveableForm } from './saveable-form';
import { TabsShowcase } from './tabs-showcase';

/** Buttons projected into the CDK overlay (the open dialog) live outside the fixture. */
const overlayButton = (text: string): HTMLButtonElement => {
  const container = document.querySelector('.cdk-overlay-container');
  const button = Array.from(container?.querySelectorAll('button') ?? []).find(
    (b) => b.textContent!.trim() === text
  );
  if (!button) throw new Error(`overlay button "${text}" not found`);
  return button as HTMLButtonElement;
};

const setup = async () => {
  await TestBed.configureTestingModule({
    imports: [TabsShowcase],
  }).compileComponents();

  const fixture = TestBed.createComponent(TabsShowcase);
  const component = fixture.componentInstance;
  fixture.detectChanges();
  await fixture.whenStable();

  // The component imports MatDialogModule, so it injects its own MatDialog
  // instance — spy on that one, not the root TestBed instance.
  const dialog = (component as unknown as { dialog: MatDialog }).dialog;
  // viewChildren(SaveableForm) — resolved once the panels have rendered.
  const forms = (component as unknown as { forms: () => SaveableForm[] }).forms();
  const formByKey = (key: string): SaveableForm => {
    const form = forms.find((f) => f.key() === key);
    if (!form) throw new Error(`saveable-form "${key}" not found`);
    return form;
  };

  return { fixture, component, dialog, formByKey };
};

describe('TabsShowcase', () => {
  afterEach(() => {
    // Real dialogs attach to a body-level overlay container that outlives the
    // fixture; clear it so each test queries a clean DOM.
    document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
  });

  it('should create', async () => {
    const { component } = await setup();

    expect(component).toBeTruthy();
  });

  it('switches the unguarded tabs when a tab is clicked', async () => {
    const { component, fixture } = await setup();

    // The first tab group ("Normal Tabs") has no beforeChange guard.
    const firstGroup = fixture.nativeElement.querySelector('app-atomic-tabs');
    const tab2 = Array.from(
      firstGroup.querySelectorAll('.atomic-tabs__tab') as NodeListOf<HTMLButtonElement>
    ).find((b) => b.textContent!.trim() === 'Tab 2')!;

    tab2.click();
    await fixture.whenStable();

    expect(component.selectedValue()).toBe('tab2');
  });

  it('switches the guarded tabs without prompting when every form is clean', async () => {
    const { component, fixture } = await setup();

    // Second group ("Tabs with Unsaved-Changes Guard"): clean forms let the
    // guard pass through, so the [(selectedValue)] binding still updates.
    const guardedGroup = fixture.nativeElement.querySelectorAll('app-atomic-tabs')[1];
    const form2 = Array.from(
      guardedGroup.querySelectorAll('.atomic-tabs__tab') as NodeListOf<HTMLButtonElement>
    ).find((b) => b.textContent!.trim() === 'Form 2')!;

    form2.click();
    await fixture.whenStable();

    expect(component.selectedValue2()).toBe('form2');
  });

  it('resolves the three guarded forms from the template', async () => {
    const { formByKey } = await setup();

    expect(formByKey('form1')).toBeTruthy();
    expect(formByKey('form2')).toBeTruthy();
    expect(formByKey('form3')).toBeTruthy();
  });

  describe('confirmLeave guard', () => {
    it('allows leaving without prompting when the form has no unsaved changes', async () => {
      const { component, dialog } = await setup();
      const openSpy = vi.spyOn(dialog, 'open');

      const result = component.confirmLeave({ from: 'form1', to: 'form2' });

      expect(result).toBe(true);
      expect(openSpy).not.toHaveBeenCalled();
    });

    it('opens the confirm dialog and, on "Discard Changes", discards and leaves', async () => {
      const { component, fixture, formByKey } = await setup();
      const leaving = formByKey('form1');
      leaving.form.controls.name.setValue('Alice');
      await fixture.whenStable();
      const discardSpy = vi.spyOn(leaving, 'discard');

      // Subscribe before closing so afterClosed's single emission isn't missed.
      const result = component.confirmLeave({ from: 'form1', to: 'form2' }) as Observable<boolean>;
      const leave = firstValueFrom(result);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(document.querySelector('.cdk-overlay-container')!.textContent).toContain(
        'You have unsaved changes'
      );

      overlayButton('Discard Changes').click();
      await fixture.whenStable();

      expect(await leave).toBe(true);
      expect(discardSpy).toHaveBeenCalledOnce();
    });

    it('keeps the user on the tab and preserves changes when the dialog is cancelled', async () => {
      const { component, fixture, formByKey } = await setup();
      const leaving = formByKey('form1');
      leaving.form.controls.name.setValue('Alice');
      await fixture.whenStable();
      const discardSpy = vi.spyOn(leaving, 'discard');

      const result = component.confirmLeave({ from: 'form1', to: 'form2' }) as Observable<boolean>;
      const leave = firstValueFrom(result);
      fixture.detectChanges();
      await fixture.whenStable();

      overlayButton('Cancel').click();
      await fixture.whenStable();

      expect(await leave).toBe(false);
      expect(discardSpy).not.toHaveBeenCalled();
      expect(leaving.hasUnsavedChanges()).toBe(true);
    });
  });
});
