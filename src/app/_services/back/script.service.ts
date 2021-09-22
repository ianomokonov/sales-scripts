import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateScriptRequest } from 'src/app/_models/requests/create-script.request';
import { SaveScriptRequest } from 'src/app/_models/requests/save-script.request';
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

  public getFolder(folderId?: number, searchString?: string): Observable<FolderResponse> {
    return this.http.get<FolderResponse>(
      `${this.baseUrl}/scripts${folderId ? `/${folderId}` : ``}${
        searchString ? `?searchString=${encodeURIComponent(searchString)}` : ``
      }`,
    );
  }

  public getFolders(): Observable<IdNameResponse[]> {
    return this.http.get<IdNameResponse[]>(`${this.baseUrl}/folders`);
  }

  public getBlocks(scriptId: number): Observable<IdNameResponse[]> {
    return this.http.get<IdNameResponse[]>(`${this.baseUrl}/script/${scriptId}/blocks`);
  }

  public addScript(request: CreateScriptRequest): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/admin/script`, request);
  }

  public updateScript(request: SaveScriptRequest, id: number): Observable<boolean> {
    return this.http.put<boolean>(`${this.baseUrl}/admin/script/${id}`, request);
  }

  public deleteScript(scriptId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/admin/script/${scriptId}`);
  }

  public reorderBlocks(id: number, blocks: { id: number; index: number }[]): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/admin/script/${id}/reorder-blocks`, { blocks });
  }

  public canOpenScript(scriptId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/script/${scriptId}/is-opened`);
  }
}
