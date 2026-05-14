import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Capitalize } from '../../shared/directives/capitalize/capitalize';
import { CapitalizeShowcase } from './capitalize-showcase';

const setup = async () => {
  await TestBed.configureTestingModule({
    imports: [CapitalizeShowcase],
  }).compileComponents();

  const fixture = TestBed.createComponent(CapitalizeShowcase);
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();

  return { fixture, component: fixture.componentInstance };
};

describe('CapitalizeShowcase', () => {
  let component: CapitalizeShowcase;
  let fixture: ComponentFixture<CapitalizeShowcase>;

  beforeEach(async () => {
    ({ component, fixture } = await setup());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the page title', () => {
    const h1 = fixture.debugElement.query(By.css('h1'));
    expect(h1.nativeElement.textContent).toBe('Capitalize Directive');
  });

  it('should apply appCapitalize to every text input', () => {
    const capitalizedInputs = fixture.debugElement.queryAll(By.directive(Capitalize));
    expect(capitalizedInputs.length).toBe(3);
  });

  it('should capitalize a text input on blur', () => {
    const input = fixture.nativeElement.querySelector(
      'input[formControlName="fullName"]'
    ) as HTMLInputElement;

    input.value = 'grace hopper';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();

    expect(input.value).toBe('Grace Hopper');
  });

  it('should submit the capitalized form values', () => {
    const input = fixture.nativeElement.querySelector(
      'input[formControlName="jobTitle"]'
    ) as HTMLInputElement;
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    input.value = 'chief computer scientist';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new FocusEvent('blur'));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Chief Computer Scientist');
  });
});
