import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BlockService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  public markFavorite(id: number, isFavorite: boolean, userScriptId: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/block/${id}/mark`, { isFavorite, userScriptId });
  }

  public delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/block/${id}`);
  }
}
