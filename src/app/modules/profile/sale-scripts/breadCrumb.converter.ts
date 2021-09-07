import { MenuItem } from 'primeng/api';
import { IdNameResponse } from '../../../_models/responses/id-name.response';

export function convertToBreadCrumb(items?: IdNameResponse[]): MenuItem[] {
  const data: MenuItem[] = [
    {
      icon: 'pi pi-home',
      routerLink: ['/profile', 'scripts'],
    },
  ];
  if (items) {
    items.forEach((item) => {
      data.push({
        label: item.name,
        routerLink: ['/profile', 'scripts', item.id],
      });
    });
  }
  return data;
}
