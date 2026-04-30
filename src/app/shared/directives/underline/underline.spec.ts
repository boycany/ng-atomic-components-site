import { Component, ElementRef, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { UnderlineDirective } from './underline';

@Component({
  imports: [UnderlineDirective],
  template: `<span #host appUnderline>underline me</span>`,
})
class HostComponent {
  readonly host = viewChild.required<ElementRef<HTMLElement>>('host');
  readonly directive = viewChild.required(UnderlineDirective);
}

const setup = async () => {
  await TestBed.configureTestingModule({
    imports: [HostComponent],
  }).compileComponents();

  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  await fixture.whenStable();

  const component = fixture.componentInstance;
  return {
    fixture,
    component,
    hostEl: component.host().nativeElement,
    directive: component.directive(),
  };
};

describe('UnderlineDirective', () => {
  it('should create', async () => {
    const { directive } = await setup();
    expect(directive).toBeTruthy();
  });

  it('should apply underline text-decoration to the host element', async () => {
    const { hostEl } = await setup();
    expect(hostEl.style.textDecoration).toBe('underline');
  });
});
