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
  it('creates the app shell component', () => {
    return setup().then(({ component }) => {
      expect(component).toBeTruthy();
    });
  });

  it('renders header navigation links and one separator', async () => {
    const { fixture } = await setup();

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const headerLinks = nativeElement.querySelectorAll('header nav app-atomic-link');
    const separators = Array.from(nativeElement.querySelectorAll('.section .row span')).filter(
      (el) => el.textContent?.trim() === '|'
    );

    expect(headerLinks.length).toBe(2);
    expect(separators.length).toBe(1);
    expect(nativeElement.textContent).toContain('Home');
    expect(nativeElement.textContent).toContain('Buttons');
  });

  it('renders footer message and GitHub repository link', async () => {
    const { fixture } = await setup();

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const footer = nativeElement.querySelector('footer.section');
    const footerLinks = nativeElement.querySelectorAll('footer app-atomic-link');

    expect(footer).toBeTruthy();
    expect(footer?.textContent).toContain(
      'To see the sourcecode with full unit tests and e2e test, visit the'
    );
    expect(footer?.textContent).toContain('GitHub Repository');
    expect(footerLinks.length).toBe(1);
  });

  it('does not render atomic button components in the app shell', async () => {
    const { fixture } = await setup();

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const buttonComponents = nativeElement.querySelectorAll('app-atomic-button');

    expect(buttonComponents.length).toBe(0);
  });

  it('renders shell structure with two dividers and router outlet', async () => {
    const { fixture } = await setup();

    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    expect(nativeElement.querySelectorAll('mat-divider').length).toBe(2);
    expect(nativeElement.querySelector('router-outlet')).toBeTruthy();
  });
});
