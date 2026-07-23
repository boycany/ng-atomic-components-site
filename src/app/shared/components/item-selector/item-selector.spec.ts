import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSelector } from './item-selector';
import { ItemTemplateDirective } from './item-template.directive';
import { ItemContainerDirective } from './item-container.directive';

const optionButtons = (fixture: ComponentFixture<unknown>, selector = 'button.option-item') =>
  Array.from(fixture.nativeElement.querySelectorAll(selector)) as HTMLButtonElement[];

const stabilize = async (fixture: ComponentFixture<unknown>) => {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
};

describe('ItemSelector', () => {
  describe('default rendering (no projected content)', () => {
    @Component({
      imports: [ItemSelector],
      template: `
        <app-item-selector title="Color" [options]="options" [(selectedOption)]="selected" />
      `,
    })
    class HostComponent {
      options = ['red', 'blue', 'green'];
      selected = signal('red');
    }

    const setup = async () => {
      await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
      const fixture = TestBed.createComponent(HostComponent);
      await stabilize(fixture);
      return { fixture, host: fixture.componentInstance };
    };

    it('renders the title', async () => {
      const { fixture } = await setup();
      expect(fixture.nativeElement.querySelector('span')?.textContent?.trim()).toBe('Color');
    });

    it('renders a listbox with an option per item, in order', async () => {
      const { fixture } = await setup();
      const listbox = fixture.nativeElement.querySelector('.options-list') as HTMLElement;

      expect(listbox.getAttribute('role')).toBe('listbox');
      expect(listbox.getAttribute('aria-label')).toBe('Color');

      const buttons = optionButtons(fixture);
      expect(buttons.map((b) => b.textContent?.trim())).toEqual(['red', 'blue', 'green']);
      buttons.forEach((b) => {
        expect(b.getAttribute('role')).toBe('option');
        expect(b.getAttribute('type')).toBe('button');
      });
    });

    it('marks only the currently selected option via class and aria-selected', async () => {
      const { fixture } = await setup();
      const [red, blue, green] = optionButtons(fixture);

      expect(red.classList.contains('is-selected')).toBe(true);
      expect(red.getAttribute('aria-selected')).toBe('true');
      expect(blue.getAttribute('aria-selected')).toBe('false');
      expect(green.getAttribute('aria-selected')).toBe('false');
    });

    it('updates the two-way selectedOption model and the rendered selection when an option is clicked', async () => {
      const { fixture, host } = await setup();
      const [red, blue] = optionButtons(fixture);

      blue.click();
      await stabilize(fixture);

      expect(host.selected()).toBe('blue');
      expect(blue.classList.contains('is-selected')).toBe(true);
      expect(blue.getAttribute('aria-selected')).toBe('true');
      expect(red.classList.contains('is-selected')).toBe(false);
      expect(red.getAttribute('aria-selected')).toBe('false');
    });

    it('gives only the selected option a roving tabindex of 0, the rest -1', async () => {
      const { fixture, host } = await setup();
      const [red, blue, green] = optionButtons(fixture);

      expect(red.tabIndex).toBe(0);
      expect(blue.tabIndex).toBe(-1);
      expect(green.tabIndex).toBe(-1);

      blue.click();
      await stabilize(fixture);

      expect(host.selected()).toBe('blue');
      expect(red.tabIndex).toBe(-1);
      expect(blue.tabIndex).toBe(0);
    });

    it('moves focus between options with ArrowRight/ArrowLeft and wraps at the edges', async () => {
      const { fixture } = await setup();
      const listbox = fixture.nativeElement.querySelector('.options-list') as HTMLElement;
      const [red, blue, green] = optionButtons(fixture);

      red.focus();
      listbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      expect(fixture.nativeElement.ownerDocument.activeElement).toBe(blue);

      listbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      expect(fixture.nativeElement.ownerDocument.activeElement).toBe(green);

      listbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      expect(fixture.nativeElement.ownerDocument.activeElement).toBe(red);

      listbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      expect(fixture.nativeElement.ownerDocument.activeElement).toBe(green);
    });

    it('moves focus to the first/last option with Home/End', async () => {
      const { fixture } = await setup();
      const listbox = fixture.nativeElement.querySelector('.options-list') as HTMLElement;
      const [red, , green] = optionButtons(fixture);

      listbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
      expect(fixture.nativeElement.ownerDocument.activeElement).toBe(green);

      listbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
      expect(fixture.nativeElement.ownerDocument.activeElement).toBe(red);
    });
  });

  describe('with no matching selectedOption yet', () => {
    @Component({
      imports: [ItemSelector],
      template: `<app-item-selector title="Color" [options]="options" />`,
    })
    class HostComponent {
      options = ['red', 'blue', 'green'];
    }

    it('falls back the roving tabindex to the first option so the listbox stays keyboard-reachable', async () => {
      await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
      const fixture = TestBed.createComponent(HostComponent);
      await stabilize(fixture);

      const [red, blue, green] = optionButtons(fixture);
      expect(red.tabIndex).toBe(0);
      expect(blue.tabIndex).toBe(-1);
      expect(green.tabIndex).toBe(-1);
      expect(red.classList.contains('is-selected')).toBe(false);
    });
  });

  describe('with appItemTemplate content projection', () => {
    @Component({
      imports: [ItemSelector, ItemTemplateDirective],
      template: `
        <app-item-selector title="Color" [options]="options" [(selectedOption)]="selected">
          <span *appItemTemplate="let color" class="custom-item" [attr.data-color]="color">{{
            color.toUpperCase()
          }}</span>
        </app-item-selector>
      `,
    })
    class HostComponent {
      options = ['red', 'blue'];
      selected = signal('red');
    }

    const setup = async () => {
      await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
      const fixture = TestBed.createComponent(HostComponent);
      await stabilize(fixture);
      return { fixture, host: fixture.componentInstance };
    };

    it('renders the projected template inside each option button instead of the raw option text', async () => {
      const { fixture } = await setup();
      const buttons = optionButtons(fixture);
      const customItems = fixture.nativeElement.querySelectorAll(
        'button.option-item .custom-item'
      ) as NodeListOf<HTMLElement>;

      expect(buttons.length).toBe(2);
      expect(customItems.length).toBe(2);
      expect(customItems[0].textContent?.trim()).toBe('RED');
      expect(customItems[0].getAttribute('data-color')).toBe('red');
      expect(customItems[1].textContent?.trim()).toBe('BLUE');
    });

    it('still selects an option by clicking its button', async () => {
      const { fixture, host } = await setup();
      const [, blueButton] = optionButtons(fixture);

      blueButton.click();
      await stabilize(fixture);

      expect(host.selected()).toBe('blue');
    });
  });

  describe('with appItemContainer content projection', () => {
    @Component({
      imports: [ItemSelector, ItemContainerDirective],
      template: `
        <app-item-selector title="Font" [options]="options" [(selectedOption)]="selected">
          <button
            type="button"
            class="custom-container"
            *appItemContainer="
              let font;
              let isChosen = isSelected;
              let action = onSelect;
              let idx = tabIndex
            "
            [tabIndex]="idx"
            [class.chosen]="isChosen"
            (click)="action()"
          >
            {{ font }}
          </button>
        </app-item-selector>
      `,
    })
    class HostComponent {
      options = ['Arial', 'Georgia'];
      selected = signal('Arial');
    }

    const setup = async () => {
      await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
      const fixture = TestBed.createComponent(HostComponent);
      await stabilize(fixture);
      return { fixture, host: fixture.componentInstance };
    };

    it('renders the custom container instead of the default option button', async () => {
      const { fixture } = await setup();
      const customButtons = Array.from(
        fixture.nativeElement.querySelectorAll('button.custom-container')
      ) as HTMLButtonElement[];

      expect(optionButtons(fixture).length).toBe(0);
      expect(customButtons.map((b) => b.textContent?.trim())).toEqual(['Arial', 'Georgia']);
    });

    it('passes isSelected through the template context for each item', async () => {
      const { fixture } = await setup();
      const [arial, georgia] = Array.from(
        fixture.nativeElement.querySelectorAll('button.custom-container')
      ) as HTMLButtonElement[];

      expect(arial.classList.contains('chosen')).toBe(true);
      expect(georgia.classList.contains('chosen')).toBe(false);
    });

    it('invokes the onSelect callback from the template context and updates the model', async () => {
      const { fixture, host } = await setup();
      const [, georgia] = Array.from(
        fixture.nativeElement.querySelectorAll('button.custom-container')
      ) as HTMLButtonElement[];

      georgia.click();
      await stabilize(fixture);

      expect(host.selected()).toBe('Georgia');
      expect(georgia.classList.contains('chosen')).toBe(true);
    });

    it('passes a roving tabIndex through the template context', async () => {
      const { fixture } = await setup();
      const [arial, georgia] = Array.from(
        fixture.nativeElement.querySelectorAll('button.custom-container')
      ) as HTMLButtonElement[];

      expect(arial.tabIndex).toBe(0);
      expect(georgia.tabIndex).toBe(-1);
    });
  });
});
