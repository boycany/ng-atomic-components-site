import { TestBed } from '@angular/core/testing';
import { NoPreloading, provideRouter, withPreloading } from '@angular/router';

import { BreadcrumbShowcase } from './breadcrumb-showcase';

const setup = async () => {
  await TestBed.configureTestingModule({
    imports: [BreadcrumbShowcase],
    providers: [provideRouter([], withPreloading(NoPreloading))],
  }).compileComponents();

  const fixture = TestBed.createComponent(BreadcrumbShowcase);
  const component = fixture.componentInstance;

  return { fixture, component };
};

describe('BreadcrumbShowcase', () => {
  it('should create', async () => {
    const { component } = await setup();

    expect(component).toBeTruthy();
  });
});
