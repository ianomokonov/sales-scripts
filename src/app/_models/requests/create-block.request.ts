import { SaveBlockRequest } from './save-block.request';

export interface CreateBlockRequest extends SaveBlockRequest {
  scriptId: number;
}
