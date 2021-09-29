import { BreadCrumbResponse } from '../_models/responses/bread-crumb.response';
import { IdNameResponse } from '../_models/responses/id-name.response';
import { BaseEntity } from './base.entity';
import { Block } from './block.entity';

export interface Script extends BaseEntity {
  name: string;
  blocks: Block[];
  breadCrumbs: BreadCrumbResponse[];
  favoriteBlocks?: IdNameResponse[];
}
