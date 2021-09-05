import { BreadCrumbResponse } from '../_models/responses/bread-crumb.response';
import { BaseEntity } from './base.entity';
import { Block } from './block.entity';

export interface Script extends BaseEntity {
  name: string;
  blocks: Block[];
  breadCrumbs: BreadCrumbResponse[];
}
