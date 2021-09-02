import { BaseEntity } from './base.entity';
import { Block } from './block.entity';

export interface Script extends BaseEntity {
  name: string;
  isFolder: boolean;
  parentFolderId: number | null;
  blocks: Block[];
}
