import { TestBed } from '@angular/core/testing';

import { BlogPostService } from './blogpost.service';

describe('BlogpostService', () => {
  let service: BlogPostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlogPostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
