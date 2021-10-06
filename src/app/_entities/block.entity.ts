import { SafeHtml } from '@angular/platform-browser';
import { BaseEntity } from './base.entity';
import { Transition } from './transition.entity';

export interface Block extends BaseEntity {
  name: string;
  description: string;
  safeDescription?: SafeHtml;
  isFavorite: boolean;
  blockIndex: number;
  isOpened?: boolean;
  incommingTransitions?: Transition[];
  outgoingTransitions?: Transition[];

  isGroup?: boolean;
}
