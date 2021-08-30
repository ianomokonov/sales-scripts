import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { refreshTokenKey, tokenKey } from '../../_utils/constants';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  public getRefreshToken() {
    return localStorage.getItem(refreshTokenKey);
  }

  public getToken() {
    return localStorage.getItem(tokenKey);
  }

  public storeTokens(tokens: string[]) {
    localStorage.setItem(tokenKey, tokens[0]);
    localStorage.setItem(refreshTokenKey, tokens[1]);
  }

  public removeTokens() {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(refreshTokenKey);
  }

  public refreshToken(token: string): Observable<string[]> {
    return this.http.post<string[]>(`${this.baseUrl}/refresh-token`, { token }).pipe(
      tap((tokens: string[]) => {
        this.storeTokens(tokens);
      }),
    );
  }
}
