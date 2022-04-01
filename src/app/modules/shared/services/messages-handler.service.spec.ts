import { TestBed } from '@angular/core/testing';

import { MessagesHandlerService } from './messages-handler.service';

describe('MessagesHandlerService', () => {
  let service: MessagesHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessagesHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
