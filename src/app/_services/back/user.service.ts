import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../front/auth.service';
import { environment } from '../../../environments/environment';
import { User } from '../../_entities/user.entity';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environment.baseUrl;
  private user: User | undefined;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  public logIn(data: any): Observable<User> {
    return this.http.post<string[]>(`${this.baseUrl}/login`, data).pipe(
      tap((tokens: string[]) => {
        this.authService.storeTokens(tokens);
      }),
      mergeMap(() => {
        return this.getUserInfo();
      }),
    );
  }

  public logOut() {
    const token = this.authService.getRefreshToken();
    return (
      token
        ? this.http.post<string>(`${this.baseUrl}/user/delete-token`, {
            token: this.authService.getRefreshToken(),
          })
        : of(null)
    ).pipe(
      // @ts-ignore
      tap(() => {
        this.authService.removeTokens();
        delete this.user;
        this.router.navigate(['/']);
      }),
    );
  }

  public addUser(data: any): Observable<User> {
    return this.http.post<string[]>(`${this.baseUrl}/sign-up`, data).pipe(
      tap((tokens: string[]) => {
        this.authService.storeTokens(tokens);
      }),
      mergeMap(() => {
        return this.getUserInfo();
      }),
    );
  }

  public getUserInfo(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/user/user-info`).pipe(
      tap((user) => {
        this.user = user;
      }),
    );
  }

  public checkAdmin(): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/user/check-admin`);
  }

  public refreshPassword(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/update-password`, { email });
  }

  public setNewPassword(password: string) {
    return this.http.post(`${this.baseUrl}/user/update-password`, { password });
  }
}
