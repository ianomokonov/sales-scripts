import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateBlockRequest } from 'src/app/_models/requests/create-block.request';
import { SaveBlockRequest } from 'src/app/_models/requests/save-block.request';
import { SaveTransitionRequest } from 'src/app/_models/requests/save-transition.request';
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

  public addTransition(blockId: number, request: SaveTransitionRequest): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/admin/block/${blockId}/transition`, request);
  }

  public deleteTransition(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/admin/transition/${id}`);
  }

  public updateBlock(id: number, request: SaveBlockRequest): Observable<number> {
    return this.http.put<number>(`${this.baseUrl}/admin/block/${id}`, request);
  }

  public updateTransition(id: number, request: SaveTransitionRequest): Observable<number> {
    return this.http.put<number>(`${this.baseUrl}/admin/transition/${id}`, request);
  }
}
