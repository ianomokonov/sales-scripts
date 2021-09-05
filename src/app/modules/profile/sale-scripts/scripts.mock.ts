import { ScriptShortView } from 'src/app/_models/script-short-view';

export const scriptsMock: ScriptShortView[] = [
  {
    id: 1,
    name: 'Скрипт 1',
    isFolder: false,
    parentFolderId: null,

    createDate: new Date(),
  },
  {
    id: 2,
    name: 'Директория 1',
    isFolder: true,
    parentFolderId: null,

    createDate: new Date(),
  },
  {
    id: 3,
    name: 'Директория 2',
    isFolder: true,
    parentFolderId: 2,

    createDate: new Date(),
  },
  {
    id: 4,
    name: 'Скрипт 2',
    isFolder: false,
    parentFolderId: 2,

    createDate: new Date(),
  },
  {
    id: 5,
    name: 'Скрипт 3',
    isFolder: false,
    parentFolderId: 3,

    createDate: new Date(),
  },
  {
    id: 8,
    name: 'Скрипт 4',
    isFolder: false,
    parentFolderId: 6,

    createDate: new Date(),
  },
  {
    id: 6,
    name: 'Директория 3',
    isFolder: true,
    parentFolderId: 3,

    createDate: new Date(),
  },
  {
    id: 7,
    name: 'Директория 4',
    isFolder: true,
    parentFolderId: 6,

    createDate: new Date(),
  },
];