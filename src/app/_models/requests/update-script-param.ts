import { SaveScriptParamRequest } from './save-script-param.request';

export interface UpdateScriptParamRequest extends SaveScriptParamRequest {
  id: number;
}
