import { MenuItem } from 'primeng/api';
import { IdNameResponse } from '../../../_models/responses/id-name.response';

function genBreadCrumb(data: MenuItem[], items: IdNameResponse[]) {
  items.forEach((item) => {
    data.push({
      label: item.name,
      routerLink: ['/profile', 'scripts', item.id],
    });
  });
}

export function convertToBreadCrumb(items?: IdNameResponse[]) {
  let crumbs;
  const data: MenuItem[] = [
    {
      icon: 'pi pi-home',
      routerLink: ['/profile', 'scripts'],
    },
  ];
  if (items) {
    if (items.length > 6) {
      const start = items.slice(0, 3);
      crumbs = items.slice(3, items.length - 3);
      const end = items.slice(items.length - 3, items.length);
      genBreadCrumb(data, start);
      data.push({
        id: 'toggle',
        label: '...',
        styleClass: 'cursor-pointer',
      });
      genBreadCrumb(data, end);
    } else {
      genBreadCrumb(data, items);
    }
  }
  return { data, crumbs };
}
