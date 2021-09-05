import { ScriptShortView } from '../script-short-view';

export interface FolderResponse {
  id: number;
  name: string;
  parentFolderId: number;
  scripts: ScriptShortView[];
}
