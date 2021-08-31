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
      index: 4,
    },
    { id: 6, name: 'Name 2', isFavorite: false, index: 5 },
    { id: 7, name: 'Name 3', isFavorite: false, index: 6 },
    { id: 8, name: 'Name 4', isFavorite: true, index: 7 },
    {
      id: 9,
      name: 'Name 1',
      isFavorite: true,
      index: 8,
    },
    { id: 10, name: 'Name 2', isFavorite: false, index: 9 },
    { id: 11, name: 'Name 3', isFavorite: false, index: 10 },
    { id: 12, name: 'Name 4', isFavorite: true, index: 11 },
    {
      id: 13,
      name: 'Name 1',
      isFavorite: true,
      index: 12,
    },
    { id: 14, name: 'Name 2', isFavorite: false, index: 13 },
    { id: 15, name: 'Name 3', isFavorite: false, index: 14 },
    { id: 16, name: 'Name 4', isFavorite: true, index: 15 },
    {
      id: 17,
      name: 'Name 1',
      isFavorite: true,
      index: 16,
    },
    { id: 18, name: 'Name 2', isFavorite: false, index: 17 },
    { id: 19, name: 'Name 3', isFavorite: false, index: 18 },
    { id: 20, name: 'Name 4', isFavorite: true, index: 19 },
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

  public onReorder([block]: ScriptBlock[]) {
    const curIndex = this.scriptBlocks.findIndex((b) => b.id === block.id);
    if (curIndex < block.index) {
      for (let i = block.index; i >= curIndex; i -= 1) {
        this.scriptBlocks[i].index = i;
      }
      return;
    }
    for (let i = block.index; i <= curIndex; i += 1) {
      this.scriptBlocks[i].index = i;
    }
  }
}
