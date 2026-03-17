import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoPreloading, provideRouter, withPreloading } from '@angular/router';

import { BreadcrumbShowcase } from './breadcrumb-showcase';

const setup = async () => {
  await TestBed.configureTestingModule({
    imports: [BreadcrumbShowcase],
    providers: [provideRouter([], withPreloading(NoPreloading))],
  }).compileComponents();

  const fixture = TestBed.createComponent(BreadcrumbShowcase);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return { fixture, component };
};

describe('BreadcrumbShowcase', () => {
  it('should create', async () => {
    const { component } = await setup();

    expect(component).toBeTruthy();
  });

  it('should render two breadcrumb components', async () => {
    const { fixture } = await setup();
    const breadcrumbs = fixture.debugElement.queryAll(By.css('app-atomic-breadcrumb'));

    expect(breadcrumbs.length).toBe(2);
  });

  it('should pass default items to the first breadcrumb', async () => {
    const { component } = await setup();

    expect(component.breadcrumbItems).toHaveLength(4);
    expect(component.breadcrumbItems[0]).toEqual({ label: 'Home', to: '/' });
    expect(component.breadcrumbItems[3]).toEqual({ label: 'Current Page' });
  });

  it('should pass custom separator to the second breadcrumb', async () => {
    const { component } = await setup();

    expect(component.customSeparator).toBe('>');
    expect(component.breadcrumbItemsWithCustomSeparator).toHaveLength(4);
  });
});
