import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Script } from '../../_entities/script.entity';

@Injectable()
export class ScriptService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  public getScript(id: number): Observable<Script> {
    return this.http.get<Script>(`${this.baseUrl}/script/${id}`);
  }

  public getScripts(filters?: any): Observable<Script[]> {
    return this.http.get<Script[]>(`${this.baseUrl}/script`, { params: filters });
  }

  public addScript(script: Script): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/script`, script);
  }

  public reorderBlocks(id: number, blocks: { id: number; index: number }[]): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/script/${id}/reorder-blocks`, { blocks });
  }
}
