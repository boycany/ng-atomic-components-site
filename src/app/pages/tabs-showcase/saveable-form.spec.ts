import { TestBed } from '@angular/core/testing';

import { SaveableForm } from './saveable-form';

const setup = async (key = 'form1') => {
  await TestBed.configureTestingModule({
    imports: [SaveableForm],
  }).compileComponents();

  const fixture = TestBed.createComponent(SaveableForm);
  const component = fixture.componentInstance;
  fixture.componentRef.setInput('key', key);
  fixture.detectChanges();

  return { fixture, component };
};

describe('SaveableForm', () => {
  it('should create', async () => {
    const { component } = await setup();

    expect(component).toBeTruthy();
    expect(component.key()).toBe('form1');
  });

  it('starts clean: not saved and with no unsaved changes', async () => {
    const { component } = await setup();

    expect(component.saved()).toBe(false);
    expect(component.hasUnsavedChanges()).toBe(false);
  });

  it('flags unsaved changes once a field is edited', async () => {
    const { component, fixture } = await setup();

    component.form.controls.name.setValue('Alice');
    await fixture.whenStable();

    expect(component.hasUnsavedChanges()).toBe(true);
  });

  it('save() snapshots the value, marks it saved and locks the form', async () => {
    const { component, fixture } = await setup();

    component.form.controls.name.setValue('Alice');
    await fixture.whenStable();
    component.save();

    expect(component.saved()).toBe(true);
    // Saving clears the unsaved-changes flag even though the form was dirty.
    expect(component.hasUnsavedChanges()).toBe(false);
    expect(component.form.disabled).toBe(true);
  });

  it('edit() re-opens a saved form and clears the dirty flag', async () => {
    const { component, fixture } = await setup();

    component.form.controls.name.setValue('Alice');
    await fixture.whenStable();
    component.save();
    component.edit();

    expect(component.saved()).toBe(false);
    expect(component.form.enabled).toBe(true);
    expect(component.hasUnsavedChanges()).toBe(false);
  });

  describe('rendered template', () => {
    const buttonByText = (fixture: ReturnType<typeof TestBed.createComponent>, text: string) => {
      const button = Array.from(
        fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>
      ).find((b) => b.textContent!.trim() === text);
      if (!button) throw new Error(`button "${text}" not found`);
      return button;
    };

    it('shows the unsaved-changes hint after a field is edited', async () => {
      const { component, fixture } = await setup();

      component.form.controls.name.setValue('Alice');
      await fixture.whenStable();
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Unsaved changes');
    });

    it('saves through the submit button and swaps to the read-only/Edit view', async () => {
      const { component, fixture } = await setup();

      component.form.controls.name.setValue('Alice');
      await fixture.whenStable();
      fixture.detectChanges();

      buttonByText(fixture, 'Save').click();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(component.saved()).toBe(true);
      expect(fixture.nativeElement.textContent).toContain('Saved (read-only)');

      buttonByText(fixture, 'Edit').click();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(component.saved()).toBe(false);
    });
  });

  describe('discard()', () => {
    it('resets a never-saved form back to blank and clears unsaved changes', async () => {
      const { component, fixture } = await setup();

      component.form.controls.name.setValue('Alice');
      await fixture.whenStable();
      component.discard();

      expect(component.form.getRawValue()).toEqual({ name: '', phone: '' });
      expect(component.hasUnsavedChanges()).toBe(false);
      expect(component.saved()).toBe(false);
    });

    it('restores the last saved snapshot and re-locks a previously saved form', async () => {
      const { component, fixture } = await setup();

      component.form.controls.name.setValue('Alice');
      await fixture.whenStable();
      component.save();

      // Re-open, change again, then bail out.
      component.edit();
      component.form.controls.name.setValue('Bob');
      await fixture.whenStable();
      component.discard();

      expect(component.form.getRawValue()).toEqual({ name: 'Alice', phone: '' });
      expect(component.saved()).toBe(true);
      expect(component.form.disabled).toBe(true);
      expect(component.hasUnsavedChanges()).toBe(false);
    });
  });
});
