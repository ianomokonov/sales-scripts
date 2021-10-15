import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokensResponse } from 'src/app/_models/responses/tokens.response';
import { SetUserScripts } from 'src/app/_models/requests/set-user-scripts.request';
import { UserTask } from 'src/app/_entities/user-task';
import { TokenService } from '../front/token.service';
import { environment } from '../../../environments/environment';
import { User } from '../../_entities/user.entity';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environment.baseUrl;
  private user: User | undefined;

  constructor(
    private http: HttpClient,
    private authService: TokenService,
    private router: Router,
  ) {}

  public signIn(data: any): Observable<User> {
    return this.http.post<TokensResponse>(`${this.baseUrl}/login`, data).pipe(
      tap((tokens: TokensResponse) => {
        this.authService.storeTokens(tokens);
      }),
      mergeMap(() => {
        return this.getUserInfo();
      }),
    );
  }

  public logOut(): Observable<any> {
    const token = this.authService.getRefreshToken();
    return (
      token
        ? this.http.post<string>(`${this.baseUrl}/delete-token`, {
            token,
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

  public signUp(data: any): Observable<User> {
    return this.http.post<TokensResponse>(`${this.baseUrl}/sign-up`, data).pipe(
      tap((tokens: TokensResponse) => {
        this.authService.storeTokens(tokens);
      }),
      mergeMap(() => {
        return this.getUserInfo();
      }),
    );
  }

  public getUserInfo(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/user`).pipe(
      tap((user) => {
        this.user = user;
      }),
    );
  }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/admin/users`);
  }

  public getUserTasks(): Observable<UserTask[]> {
    return this.http.get<UserTask[]>(`${this.baseUrl}/user/tasks`);
  }

  public addUserTask(name: string): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/user/task`, { name });
  }

  public removeUserTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/user/task/${id}`);
  }

  public setUserScripts(request: SetUserScripts): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/admin/user-scripts`, request);
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
