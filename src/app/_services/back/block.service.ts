import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateBlockRequest } from 'src/app/_models/requests/create-block.request';
import { CreateTransitionRequest } from 'src/app/_models/requests/create-transition.request';
import { environment } from 'src/environments/environment';

@Injectable()
export class BlockService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  public markFavorite(id: number, isFavorite: boolean, userScriptId: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/block/${id}/mark`, { isFavorite, userScriptId });
  }

  public delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/admin/block/${id}`);
  }

  public addBlock(request: CreateBlockRequest): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/admin/block`, request);
  }

  public addTransition(blockId: number, request: CreateTransitionRequest): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/admin/block/${blockId}/transition`, request);
  }
}
