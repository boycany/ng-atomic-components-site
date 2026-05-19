import { TestBed } from '@angular/core/testing';

import { ExpanderShowcase } from './expander-showcase';

const setup = async () => {
  await TestBed.configureTestingModule({
    imports: [ExpanderShowcase],
  }).compileComponents();

  const fixture = TestBed.createComponent(ExpanderShowcase);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return { fixture, component };
};

describe('ExpanderShowcase', () => {
  it('should create', async () => {
    const { component } = await setup();

    expect(component).toBeTruthy();
  });

  it('should have 2 items in data signal by default', async () => {
    const { component } = await setup();

    expect(component.data().length).toBe(2);
  });

  it('should render correct number of expanders', async () => {
    const { fixture } = await setup();

    const expanders = fixture.nativeElement.querySelectorAll(
      'app-expander'
    ) as NodeListOf<HTMLElement>;

    // 2 from the data signal loop + 1 rich text example + 1 default-toggle example
    expect(expanders.length).toBe(4);
  });

  it('should render headers from data signal', async () => {
    const { fixture, component } = await setup();

    const headerEls = fixture.nativeElement.querySelectorAll(
      '.header-area'
    ) as NodeListOf<HTMLElement>;
    const dataItems = component.data();

    expect(headerEls[0]?.textContent?.trim()).toBe(dataItems[0]?.header);
    expect(headerEls[1]?.textContent?.trim()).toBe(dataItems[1]?.header);
  });

  it('should render the rich text expander with correct header', async () => {
    const { fixture } = await setup();

    const headerEls = fixture.nativeElement.querySelectorAll(
      '.header-area'
    ) as NodeListOf<HTMLElement>;

    expect(headerEls[2]?.textContent?.trim()).toBe('What is Content Projection?');
  });

  it('should render the projection icon in the rich text expander header', async () => {
    const { fixture } = await setup();

    const richHeader = fixture.nativeElement.querySelectorAll('.header-area')[2] as
      | HTMLElement
      | undefined;
    const icon = richHeader?.querySelector('app-icon') as HTMLElement | null;
    const iconPath = icon?.querySelector('path') as SVGPathElement | null;

    expect(icon).not.toBeNull();
    expect(iconPath?.getAttribute('d')).toBeTruthy();
  });

  it('should render all expanders as collapsed initially', async () => {
    const { fixture } = await setup();

    const expanders = fixture.nativeElement.querySelectorAll(
      'app-expander'
    ) as NodeListOf<HTMLElement>;

    expanders.forEach((expander) => {
      expect(expander.classList.contains('collapsed')).toBe(true);
    });
  });
});
