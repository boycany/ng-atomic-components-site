import { ButtonsShowcase } from './buttons-showcase';
import { TestBed } from '@angular/core/testing';

const setup = async () => {
  await TestBed.configureTestingModule({
    imports: [ButtonsShowcase],
  }).compileComponents();

  const fixture = TestBed.createComponent(ButtonsShowcase);
  const component = fixture.componentInstance;

  return { fixture, component };
};

describe('ButtonsShowcase', () => {
  it('should create', () => {
    return setup().then(({ component }) => {
      expect(component).toBeTruthy();
    });
  });

  it('renders all button groups and expected total button count', async () => {
    const { fixture } = await setup();

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const buttonComponents = nativeElement.querySelectorAll('app-atomic-button');

    expect(nativeElement.textContent).toContain('Buttons');
    expect(nativeElement.textContent).toContain('Primary');
    expect(nativeElement.textContent).toContain('Success');
    expect(nativeElement.textContent).toContain('Warn');
    expect(nativeElement.textContent).toContain('Danger');
    expect(nativeElement.textContent).toContain('Secondary');

    const generatedButtons = 5 * 3;
    const iconButtons = 3;
    const disabledButtons = 3;
    const circleButtons = 7;

    expect(buttonComponents.length).toBe(
      generatedButtons + iconButtons + disabledButtons + circleButtons
    );
  });

  it('renders icon, disabled and circle sections with expected labels', async () => {
    const { fixture } = await setup();

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;

    expect(nativeElement.textContent).toContain('Button with prepend and append icon');
    expect(nativeElement.textContent).toContain('Disabled Button');
    expect(nativeElement.textContent).toContain('Circle Button');

    expect(nativeElement.textContent).toContain('Back');
    expect(nativeElement.textContent).toContain('Next');

    expect(nativeElement.textContent).toContain('arrow_back');
    expect(nativeElement.textContent).toContain('arrow_forward');
    expect(nativeElement.textContent).toContain('check_circle');
    expect(nativeElement.textContent).toContain('arrow_drop_down');
  });
});
