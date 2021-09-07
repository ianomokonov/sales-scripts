import { TransitionType } from '../_models/transition-type';
import { BaseEntity } from './base.entity';

export interface Transition extends BaseEntity {
  name: string;
  blockId: number;
  nextBlockId: number;
  status: TransitionType;
}
