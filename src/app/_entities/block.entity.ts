import { BaseEntity } from './base.entity';

export interface Block extends BaseEntity {
  name: string;
  description: string;
  isFavorite: boolean;
  blockIndex: number;
  isOpened?: boolean;
}
