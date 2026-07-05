import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

export const AUTH_TOKEN_STORAGE_KEY = 'dsna.auth.token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly loginUrl = '/api/auth/login';
  private readonly isBrowser: boolean;

  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  login(username: string, password: string): Observable<string> {
    return this.http.post(
      this.loginUrl,
      { username, password },
      { responseType: 'text' }
    ).pipe(
      map((response) => this.extractToken(response)),
      tap((token) => this.storeToken(token))
    );
  }

  getToken(): string | null {
    return this.isBrowser
      ? localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
      : null;
  }

  clearToken(): void {
    if (this.isBrowser) {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    }
  }

  private storeToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    }
  }

  private extractToken(response: string): string {
    let token = response.trim();

    try {
      const parsedResponse: unknown = JSON.parse(token);

      if (typeof parsedResponse === 'string') {
        token = parsedResponse.trim();
      } else if (
        typeof parsedResponse === 'object'
        && parsedResponse !== null
        && 'token' in parsedResponse
        && typeof parsedResponse.token === 'string'
      ) {
        token = parsedResponse.token.trim();
      }
    } catch {
      // Plain-text JWT responses are already in the expected form.
    }

    if (token.split('.').length !== 3) {
      throw new Error('The login response did not contain a valid JWT');
    }

    return token;
  }
}
