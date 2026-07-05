import {
  HttpClient,
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AUTH_TOKEN_STORAGE_KEY } from '../services/auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.clear();
  });

  it('should attach the bearer token to API requests', () => {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, 'header.payload.signature');
    const httpClient = TestBed.inject(HttpClient);

    httpClient.get('/api/profile').subscribe();

    const request = httpTestingController.expectOne('/api/profile');
    expect(request.request.headers.get('Authorization'))
      .toBe('Bearer header.payload.signature');
    request.flush({});
  });

  it('should not attach the token to non-API requests', () => {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, 'header.payload.signature');
    const httpClient = TestBed.inject(HttpClient);

    httpClient.get('/assets/example.json').subscribe();

    const request = httpTestingController.expectOne('/assets/example.json');
    expect(request.request.headers.has('Authorization')).toBeFalse();
    request.flush({});
  });
});
