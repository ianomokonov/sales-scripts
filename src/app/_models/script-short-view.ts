import { BaseEntity } from '../_entities/base.entity';

export interface ScriptShortView extends BaseEntity {
  name: string;
  isFolder: boolean;
  parentFolderId: number | null;
}
