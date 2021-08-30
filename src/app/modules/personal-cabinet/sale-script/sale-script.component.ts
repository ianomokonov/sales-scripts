import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ScriptBlock } from './models/script-block';

@Component({
  selector: 'app-sale-script',
  templateUrl: './sale-script.component.html',
  styleUrls: ['./sale-script.component.less'],
})
export class SaleScriptComponent {
  /** Список всех блоков скрипта */
  public scriptBlocks: ScriptBlock[] = [
    {
      id: 1,
      name: 'Name 1',
      isFavorite: true,
      index: 0,
    },
    { id: 2, name: 'Name 2', isFavorite: false, index: 1 },
    { id: 3, name: 'Name 3', isFavorite: false, index: 2 },
    { id: 4, name: 'Name 4', isFavorite: true, index: 3 },
    {
      id: 5,
      name: 'Name 1',
      isFavorite: true,
      index: 0,
    },
    { id: 6, name: 'Name 2', isFavorite: false, index: 1 },
    { id: 7, name: 'Name 3', isFavorite: false, index: 2 },
    { id: 8, name: 'Name 4', isFavorite: true, index: 3 },
    {
      id: 9,
      name: 'Name 1',
      isFavorite: true,
      index: 0,
    },
    { id: 10, name: 'Name 2', isFavorite: false, index: 1 },
    { id: 11, name: 'Name 3', isFavorite: false, index: 2 },
    { id: 12, name: 'Name 4', isFavorite: true, index: 3 },
    {
      id: 13,
      name: 'Name 1',
      isFavorite: true,
      index: 0,
    },
    { id: 14, name: 'Name 2', isFavorite: false, index: 1 },
    { id: 15, name: 'Name 3', isFavorite: false, index: 2 },
    { id: 16, name: 'Name 4', isFavorite: true, index: 3 },
    {
      id: 17,
      name: 'Name 1',
      isFavorite: true,
      index: 0,
    },
    { id: 18, name: 'Name 2', isFavorite: false, index: 1 },
    { id: 19, name: 'Name 3', isFavorite: false, index: 2 },
    { id: 20, name: 'Name 4', isFavorite: true, index: 3 },
  ];

  /** Список отмеченных блоков */
  public get favoriteBlocks(): ScriptBlock[] {
    return this.scriptBlocks?.filter((b) => b.isFavorite);
  }

  constructor(private confirmService: ConfirmationService) {}

  public onRemoveBlock(id: number, event: MouseEvent) {
    event.stopPropagation();
    this.confirmService.confirm({
      message: 'Удалить блок из скрипта?',
      accept: () => {
        this.scriptBlocks = this.scriptBlocks.filter((b) => b.id !== id);
      },
    });
  }

  public onMarkBlock(id: number, event: MouseEvent) {
    const block = this.scriptBlocks.find((b) => b.id === id);
    if (!block) {
      return;
    }

    event.stopPropagation();
    block.isFavorite = !block.isFavorite;
  }

  public onMarkedBlockClick(id: number) {
    const markedBlock = this.scriptBlocks.find((b) => b.id === id);
    if (!markedBlock) {
      return;
    }
    markedBlock.isOpened = true;
    const block = document.querySelector<HTMLDivElement>(`.tab-${id}`);
    if (!block) {
      return;
    }
    block.focus();
    if (window.innerHeight - block.getBoundingClientRect().bottom < 50) {
      setTimeout(() => {
        block.scrollIntoView({ behavior: 'smooth' });
      }, 250);
    }
  }
}
