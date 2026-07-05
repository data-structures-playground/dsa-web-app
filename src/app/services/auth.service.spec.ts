import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { AUTH_TOKEN_STORAGE_KEY, AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should cache the JWT returned by login', () => {
    const token = 'header.payload.signature';

    service.login('alice', 'password').subscribe((result) => {
      expect(result).toBe(token);
      expect(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)).toBe(token);
    });

    const request = httpTestingController.expectOne('/api/auth/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      username: 'alice',
      password: 'password'
    });
    request.flush(JSON.stringify({ token }));
  });
});
