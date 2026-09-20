/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';

import { SpinnerService } from './spinner.service';

describe('SpinnerService', () => {
  let service: SpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit loading state when shown and hidden', () => {
    let isLoading = false;
    service.loading$.subscribe((loading) => {
      isLoading = loading;
    });

    service.show();
    expect(isLoading).toBeTrue();

    service.hide();
    expect(isLoading).toBeFalse();
  });
});
