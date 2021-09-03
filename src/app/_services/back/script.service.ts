import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateScriptRequest } from 'src/app/_models/requests/create-script.request';
import { ScriptShortView } from 'src/app/_models/script-short-view';
import { environment } from 'src/environments/environment';
import { Script } from '../../_entities/script.entity';

@Injectable()
export class ScriptService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  public getScript(id: number): Observable<Script> {
    return this.http.get<Script>(`${this.baseUrl}/script/${id}`);
  }

  public getScripts(filters?: any): Observable<ScriptShortView[]> {
    return this.http.get<ScriptShortView[]>(`${this.baseUrl}/scripts`, { params: filters });
  }

  public addScript(request: CreateScriptRequest): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/scripts`, request);
  }

  public reorderBlocks(id: number, blocks: { id: number; index: number }[]): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/scripts/${id}/reorder-blocks`, { blocks });
  }
}
