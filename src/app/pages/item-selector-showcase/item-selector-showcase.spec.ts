import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSelectorShowcase } from './item-selector-showcase';
import { COLOR_NAMES, FONT_NAMES, SIZES } from './selector-options';

const stabilize = async (fixture: ComponentFixture<unknown>) => {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
};

const textarea = (fixture: ComponentFixture<unknown>) =>
  fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;

const findButtonByText = (container: Element, selector: string, text: string) =>
  (Array.from(container.querySelectorAll(selector)) as HTMLButtonElement[]).find(
    (b) => b.textContent?.trim() === text
  );

describe('ItemSelectorShowcase', () => {
  const setup = async () => {
    await TestBed.configureTestingModule({
      imports: [ItemSelectorShowcase],
    }).compileComponents();

    const fixture = TestBed.createComponent(ItemSelectorShowcase);
    const component = fixture.componentInstance;
    await stabilize(fixture);

    return { fixture, component };
  };

  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('defaults each selector to the first option in its list', async () => {
    const { component } = await setup();

    expect(component.selectedColor()).toBe(COLOR_NAMES[0]);
    expect(component.selectedFont()).toBe(FONT_NAMES[0]);
    expect(component.selectedSize()).toBe(SIZES[0]);
  });

  it('reflects the initial selection on the preview textarea styles', async () => {
    const { fixture } = await setup();
    const area = textarea(fixture);

    expect(area.style.color).toBe(COLOR_NAMES[0]);
    expect(area.style.fontFamily).toBe(FONT_NAMES[0]);
    expect(area.style.fontSize).toBe(SIZES[0]);
  });

  it('updates the textarea color when a color option is picked', async () => {
    const { fixture, component } = await setup();
    const colorsArea = fixture.nativeElement.querySelector('.colors-area') as HTMLElement;
    const blue = findButtonByText(colorsArea, 'button.option-item', 'blue');

    blue?.click();
    await stabilize(fixture);

    expect(component.selectedColor()).toBe('blue');
    expect(textarea(fixture).style.color).toBe('blue');
  });

  it('updates the textarea font family when a font option (custom container) is picked', async () => {
    const { fixture, component } = await setup();
    const fontsArea = fixture.nativeElement.querySelector('.fonts-area') as HTMLElement;
    const georgia = findButtonByText(fontsArea, 'button.fonts-container', 'Georgia');

    georgia?.click();
    await stabilize(fixture);

    expect(component.selectedFont()).toBe('Georgia');
    expect(textarea(fixture).style.fontFamily).toBe('Georgia');
  });

  it('updates the textarea font size when a size option is picked', async () => {
    const { fixture, component } = await setup();
    const sizesArea = fixture.nativeElement.querySelector('.sizes-area') as HTMLElement;
    const eighteenPt = findButtonByText(sizesArea, 'button.option-item', '18pt');

    eighteenPt?.click();
    await stabilize(fixture);

    expect(component.selectedSize()).toBe('18pt');
    expect(textarea(fixture).style.fontSize).toBe('18pt');
  });
});
