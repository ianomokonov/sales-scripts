import { ScriptShortView } from '../script-short-view';
import { IdNameResponse } from './id-name.response';

export interface FolderResponse {
  id?: number;
  name?: string;
  parentFolderId?: number;
  scripts: ScriptShortView[];
  breadCrumbs?: IdNameResponse[];
}
