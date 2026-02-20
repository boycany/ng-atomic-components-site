import { TestBed } from '@angular/core/testing';
import { NoPreloading, provideRouter, withPreloading } from '@angular/router';
import { App } from './app';

const setup = async () => {
  await TestBed.configureTestingModule({
    imports: [App],
    providers: [provideRouter([], withPreloading(NoPreloading))],
  }).compileComponents();

  const fixture = TestBed.createComponent(App);
  const component = fixture.componentInstance;

  return { fixture, component };
};

describe('App', () => {
  it('should create the app', () => {
    return setup().then(({ component }) => {
      expect(component).toBeTruthy();
    });
  });

  it('renders links and separators from structured data', async () => {
    const { fixture } = await setup();

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const linkComponents = nativeElement.querySelectorAll('app-atomic-link');
    const separators = Array.from(nativeElement.querySelectorAll('.section .row span')).filter(
      (el) => el.textContent?.trim() === '|'
    );

    expect(linkComponents.length).toBe(2);
    expect(separators.length).toBe(1);
    expect(nativeElement.textContent).toContain('Home');
    expect(nativeElement.textContent).toContain('Feature');
  });

  it('renders button groups and expected number of atomic buttons', async () => {
    const { fixture } = await setup();

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const buttonComponents = nativeElement.querySelectorAll('app-atomic-button');

    const generatedButtons = 5 * 3;
    const iconButtons = 3;

    expect(buttonComponents.length).toBe(generatedButtons + iconButtons);
    expect(nativeElement.textContent).toContain('Buttons');
    expect(nativeElement.textContent).toContain('Button with prepend and append icon');
  });

  it('renders two dividers and router outlet', async () => {
    const { fixture } = await setup();

    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    expect(nativeElement.querySelectorAll('mat-divider').length).toBe(2);
    expect(nativeElement.querySelector('router-outlet')).toBeTruthy();
  });
});
