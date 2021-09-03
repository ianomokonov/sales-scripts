import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { TokensResponse } from 'src/app/_models/responses/tokens.response';
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

  public storeTokens(tokens: TokensResponse) {
    localStorage.setItem(tokenKey, tokens.token);
    localStorage.setItem(refreshTokenKey, tokens.refreshToken);
  }

  public removeTokens() {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(refreshTokenKey);
  }

  public refreshToken(token: string): Observable<TokensResponse> {
    return this.http.post<TokensResponse>(`${this.baseUrl}/refresh-token`, { token }).pipe(
      tap((tokens: TokensResponse) => {
        this.storeTokens(tokens);
      }),
    );
  }
}
