import { MenuItem } from 'primeng/api';
import { IdNameResponse } from '../../../_models/responses/id-name.response';

function genBreadCrumb(data: MenuItem[], items: IdNameResponse[] | IdNameResponse) {
  if (Array.isArray(items)) {
    items.forEach((item) => {
      data.push({
        label: item.name,
        routerLink: ['/profile', 'scripts', item.id],
      });
    });
  } else {
    data.push({
      label: items.name,
      routerLink: ['/profile', 'script', items.id],
    });
  }
}

export function convertToBreadCrumb(items?: IdNameResponse[], isScript = false) {
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
      const end = items.slice(items.length - 3, isScript ? items.length - 1 : items.length);
      genBreadCrumb(data, start);
      data.push({
        id: 'toggle',
        label: '...',
        styleClass: 'cursor-pointer',
      });
      genBreadCrumb(data, end);
    } else {
      genBreadCrumb(data, isScript ? items.slice(0, items.length - 1) : items);
    }
    if (isScript) {
      genBreadCrumb(data, items[items.length - 1]);
    }
  }
  return { data, crumbs };
}
