import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TrackMouseDirective } from '../../shared/directives/track-mouse/track-mouse';
import { TrackMouseShowcase } from './track-mouse-showcase';

const setup = async () => {
  await TestBed.configureTestingModule({
    imports: [TrackMouseShowcase],
  }).compileComponents();

  const fixture = TestBed.createComponent(TrackMouseShowcase);
  fixture.detectChanges();
  await fixture.whenStable();

  return { fixture, component: fixture.componentInstance };
};

describe('TrackMouseShowcase', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should render the page title', async () => {
    const { fixture } = await setup();
    const h1 = fixture.debugElement.query(By.css('h1'));
    expect(h1.nativeElement.textContent).toBe('Track Mouse Directive');
  });

  it('should render two example items', async () => {
    const { fixture } = await setup();
    const items = fixture.debugElement.queryAll(By.css('.example-item'));
    expect(items.length).toBe(2);
  });

  it('should apply appTrackMouse on both .field elements', async () => {
    const { fixture } = await setup();
    const trackers = fixture.debugElement.queryAll(By.directive(TrackMouseDirective));
    expect(trackers.length).toBe(2);
  });

  it('should render a ball inside the first field that mirrors tracker x/y', async () => {
    const { fixture } = await setup();

    const firstField = fixture.debugElement.queryAll(By.directive(TrackMouseDirective))[0];
    const fieldEl = firstField.nativeElement as HTMLElement;
    const ball = fieldEl.querySelector<HTMLElement>('.ball');
    expect(ball).not.toBeNull();

    vi.spyOn(fieldEl, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      right: 200,
      bottom: 200,
      width: 200,
      height: 200,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } satisfies DOMRect);

    fieldEl.dispatchEvent(
      new MouseEvent('mousemove', { clientX: 75, clientY: 125, bubbles: true })
    );
    await fixture.whenStable();
    fixture.detectChanges();

    expect(ball!.style.left).toBe('75px');
    expect(ball!.style.top).toBe('125px');
  });

  it('should not render a ball inside the second field (CSS gradient example)', async () => {
    const { fixture } = await setup();

    const secondField = fixture.debugElement.queryAll(By.directive(TrackMouseDirective))[1];
    const ball = (secondField.nativeElement as HTMLElement).querySelector('.ball');
    expect(ball).toBeNull();
  });
});
