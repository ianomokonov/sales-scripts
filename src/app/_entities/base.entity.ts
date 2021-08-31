export interface BaseEntity {
  id: number;
  createDate: Date;
  lastModifyDate?: Date;
  lastModifyUserId?: number;
}
