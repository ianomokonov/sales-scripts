import { BaseEntity } from './base.entity';
import { Transition } from './transition.entity';

export interface Block extends BaseEntity {
  name: string;
  description: string;
  isFavorite: boolean;
  blockIndex: number;
  isOpened?: boolean;
  incommingTransitions?: Transition[];
  outgoingTransitions?: Transition[];

  isGroup?: boolean;
}
