import { TransitionType } from '../transition-type';
import { CreateBlockRequest } from './create-block.request';

export interface CreateTransitionRequest {
  name: string;
  status: TransitionType;
  block?: CreateBlockRequest;
  nextBlockId?: number;
}
