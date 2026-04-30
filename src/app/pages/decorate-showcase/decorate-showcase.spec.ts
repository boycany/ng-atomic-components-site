import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DecorateDirective } from '../../shared/directives/decorate/decorate';
import { DecorateShowcase } from './decorate-showcase';

const setup = async () => {
  await TestBed.configureTestingModule({
    imports: [DecorateShowcase],
  }).compileComponents();

  const fixture = TestBed.createComponent(DecorateShowcase);
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();

  return { fixture, component: fixture.componentInstance };
};

describe('DecorateShowcase', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should render the page title', async () => {
    const { fixture } = await setup();
    const h1 = fixture.debugElement.query(By.css('h1'));
    expect(h1.nativeElement.textContent).toBe('Decorate Directive');
  });

  it('should render two example items', async () => {
    const { fixture } = await setup();
    const items = fixture.debugElement.queryAll(By.css('.example-item'));
    expect(items.length).toBe(2);
  });

  it('should apply appDecorate on both example items', async () => {
    const { fixture } = await setup();
    const decorated = fixture.debugElement.queryAll(By.directive(DecorateDirective));
    expect(decorated.length).toBe(2);
  });

  it('should render the default example with lime background and underline', async () => {
    const { fixture } = await setup();
    const items = fixture.debugElement.queryAll(By.css('.example-item'));
    const el = items[0].nativeElement as HTMLElement;

    expect(el.style.backgroundColor).toBe('lime');
    expect(el.style.textDecoration).toBe('underline');
  });

  it('should render the second example with pink background', async () => {
    const { fixture } = await setup();
    const items = fixture.debugElement.queryAll(By.css('.example-item'));
    const el = items[1].nativeElement as HTMLElement;

    expect(el.style.backgroundColor).toBe('pink');
    expect(el.style.textDecoration).toBe('underline');
  });
});
