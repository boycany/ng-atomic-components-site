import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Capitalize } from './capitalize';

@Component({
  imports: [Capitalize],
  template: '<input type="text" appCapitalize />',
})
class HostComponent {}

describe('Capitalize', () => {
  it('should apply to text inputs', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const directive = fixture.debugElement.query(By.directive(Capitalize));
    expect(directive).toBeTruthy();
  });

  it('should capitalize input words on blur', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    input.value = 'ada lovelace';
    input.dispatchEvent(new FocusEvent('blur'));

    expect(input.value).toBe('Ada Lovelace');
  });
});
