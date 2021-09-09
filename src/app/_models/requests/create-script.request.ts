import { SaveScriptRequest } from './save-script.request';

export interface CreateScriptRequest extends SaveScriptRequest {
  isFolder: boolean;
}
