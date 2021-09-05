import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateScriptRequest } from 'src/app/_models/requests/create-script.request';
import { FolderResponse } from 'src/app/_models/responses/folder.response';
import { environment } from 'src/environments/environment';
import { Script } from '../../_entities/script.entity';
import { IdNameResponse } from '../../_models/responses/id-name.response';

@Injectable()
export class ScriptService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  public getScript(id: number): Observable<Script> {
    return this.http.get<Script>(`${this.baseUrl}/script/${id}`);
  }

  public getFolder(folderId?: number): Observable<FolderResponse> {
    return this.http.get<FolderResponse>(
      `${this.baseUrl}/scripts${folderId ? `/${folderId}` : ''}`,
    );
  }

  public getFolders(): Observable<IdNameResponse[]> {
    return this.http.get<IdNameResponse[]>(`${this.baseUrl}/folders`);
  }

  public addScript(request: CreateScriptRequest): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/script`, request);
  }

  public reorderBlocks(id: number, blocks: { id: number; index: number }[]): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/script/${id}/reorder-blocks`, { blocks });
  }
}
