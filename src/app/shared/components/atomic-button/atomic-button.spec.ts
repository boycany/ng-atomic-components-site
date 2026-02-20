import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AtomicButton } from './atomic-button';

const setup = async () => {
  await TestBed.configureTestingModule({
    imports: [AtomicButton],
  }).compileComponents();

  const fixture = TestBed.createComponent(AtomicButton);
  const component = fixture.componentInstance;

  return { fixture, component };
};

@Component({
  imports: [AtomicButton],
  template: `
    <app-atomic-button>
      <span prepend>Back</span>
      <span label>Save</span>
      <span append>Now</span>
      <span>Hidden</span>
    </app-atomic-button>
  `,
})
class AtomicButtonHostComponent {}

@Component({
  imports: [AtomicButton],
  template: ` <app-atomic-button></app-atomic-button> `,
})
class AtomicButtonEmptyHostComponent {}

@Component({
  imports: [AtomicButton],
  template: `
    <app-atomic-button>
      <span label>Only Label</span>
    </app-atomic-button>
  `,
})
class AtomicButtonLabelOnlyHostComponent {}

const setupHost = async () => {
  await TestBed.configureTestingModule({
    imports: [AtomicButtonHostComponent],
  }).compileComponents();

  const fixture = TestBed.createComponent(AtomicButtonHostComponent);

  return { fixture };
};

const setupEmptyHost = async () => {
  await TestBed.configureTestingModule({
    imports: [AtomicButtonEmptyHostComponent],
  }).compileComponents();

  const fixture = TestBed.createComponent(AtomicButtonEmptyHostComponent);

  return { fixture };
};

const setupLabelOnlyHost = async () => {
  await TestBed.configureTestingModule({
    imports: [AtomicButtonLabelOnlyHostComponent],
  }).compileComponents();

  const fixture = TestBed.createComponent(AtomicButtonLabelOnlyHostComponent);

  return { fixture };
};

describe('AtomicButton', () => {
  const variants = ['contained', 'outlined', 'text'] as const;
  const colors = ['primary', 'success', 'warn', 'danger', 'secondary'] as const;
  const sizes = ['normal', 'small'] as const;
  const shapes = ['rectangle', 'circle', 'square'] as const;
  const types = ['button', 'submit', 'reset'] as const;

  it('should create', async () => {
    const { component } = await setup();

    expect(component).toBeTruthy();
  });

  it('renders default button attributes and classes', async () => {
    const { fixture } = await setup();

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button).toBeTruthy();
    expect(button.type).toBe('button');
    expect(button.disabled).toBe(false);
    expect(button.classList.contains('atomic-button')).toBe(true);
    expect(button.classList.contains('atomic-button--contained')).toBe(true);
    expect(button.classList.contains('atomic-button--primary')).toBe(true);
    expect(button.classList.contains('atomic-button--rectangle')).toBe(true);
    expect(button.classList.contains('atomic-button--normal')).toBe(true);
  });

  it('binds disabled and type inputs to native button', async () => {
    const { fixture } = await setup();

    fixture.componentRef.setInput('disabled', true);
    fixture.componentRef.setInput('type', 'submit');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.type).toBe('submit');
  });

  it('supports reset button type', async () => {
    const { fixture } = await setup();

    fixture.componentRef.setInput('type', 'reset');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.type).toBe('reset');
  });

  it('applies variant, color, size and shape classes from inputs', async () => {
    const { fixture } = await setup();

    fixture.componentRef.setInput('variant', 'outlined');
    fixture.componentRef.setInput('color', 'danger');
    fixture.componentRef.setInput('size', 'small');
    fixture.componentRef.setInput('shape', 'circle');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.classList.contains('atomic-button--outlined')).toBe(true);
    expect(button.classList.contains('atomic-button--danger')).toBe(true);
    expect(button.classList.contains('atomic-button--small')).toBe(true);
    expect(button.classList.contains('atomic-button--circle')).toBe(true);
    expect(button.classList.contains('atomic-button--contained')).toBe(false);
    expect(button.classList.contains('atomic-button--normal')).toBe(false);
    expect(button.classList.contains('atomic-button--rectangle')).toBe(false);
  });

  it('projects prepend, label, append slots only', async () => {
    const { fixture } = await setupHost();

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.textContent).toContain('Back');
    expect(button.textContent).toContain('Save');
    expect(button.textContent).toContain('Now');
    expect(button.textContent).not.toContain('Hidden');
  });

  it('renders empty content when no slot content is projected', async () => {
    const { fixture } = await setupEmptyHost();

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.textContent?.trim()).toBe('');
  });

  it('renders only label when only label slot is projected', async () => {
    const { fixture } = await setupLabelOnlyHost();

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.textContent).toContain('Only Label');
    expect(button.textContent).not.toContain('Back');
    expect(button.textContent).not.toContain('Now');
  });

  it('recomputes classes after multiple input updates', async () => {
    const { fixture } = await setup();

    fixture.componentRef.setInput('variant', 'text');
    fixture.componentRef.setInput('color', 'success');
    fixture.componentRef.setInput('size', 'small');
    fixture.componentRef.setInput('shape', 'square');
    fixture.detectChanges();

    fixture.componentRef.setInput('variant', 'contained');
    fixture.componentRef.setInput('color', 'secondary');
    fixture.componentRef.setInput('size', 'normal');
    fixture.componentRef.setInput('shape', 'rectangle');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.classList.contains('atomic-button--contained')).toBe(true);
    expect(button.classList.contains('atomic-button--secondary')).toBe(true);
    expect(button.classList.contains('atomic-button--normal')).toBe(true);
    expect(button.classList.contains('atomic-button--rectangle')).toBe(true);
    expect(button.classList.contains('atomic-button--text')).toBe(false);
    expect(button.classList.contains('atomic-button--success')).toBe(false);
    expect(button.classList.contains('atomic-button--small')).toBe(false);
    expect(button.classList.contains('atomic-button--square')).toBe(false);
  });

  variants.forEach((variant) => {
    it(`applies ${variant} variant class`, async () => {
      const { fixture } = await setup();

      fixture.componentRef.setInput('variant', variant);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
      expect(button.classList.contains(`atomic-button--${variant}`)).toBe(true);
    });
  });

  colors.forEach((color) => {
    it(`applies ${color} color class`, async () => {
      const { fixture } = await setup();

      fixture.componentRef.setInput('color', color);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
      expect(button.classList.contains(`atomic-button--${color}`)).toBe(true);
    });
  });

  sizes.forEach((size) => {
    it(`applies ${size} size class`, async () => {
      const { fixture } = await setup();

      fixture.componentRef.setInput('size', size);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
      expect(button.classList.contains(`atomic-button--${size}`)).toBe(true);
    });
  });

  shapes.forEach((shape) => {
    it(`applies ${shape} shape class`, async () => {
      const { fixture } = await setup();

      fixture.componentRef.setInput('shape', shape);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
      expect(button.classList.contains(`atomic-button--${shape}`)).toBe(true);
    });
  });

  types.forEach((type) => {
    it(`binds native button type as ${type}`, async () => {
      const { fixture } = await setup();

      fixture.componentRef.setInput('type', type);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
      expect(button.type).toBe(type);
    });
  });

  [true, false].forEach((disabled) => {
    it(`binds native disabled as ${disabled}`, async () => {
      const { fixture } = await setup();

      fixture.componentRef.setInput('disabled', disabled);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
      expect(button.disabled).toBe(disabled);
    });
  });
});
