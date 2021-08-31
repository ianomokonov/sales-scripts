import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Block } from 'src/app/_entities/block.entity';
import { ScriptService } from 'src/app/_services/back/script.service';

@Component({
  selector: 'app-sale-script',
  templateUrl: './sale-script.component.html',
  styleUrls: ['./sale-script.component.less'],
})
export class SaleScriptComponent {
  /** Список всех блоков скрипта */
  public scriptBlocks: Block[] = [];

  /** Список отмеченных блоков */
  public get favoriteBlocks(): Block[] {
    return this.scriptBlocks?.filter((b) => b.isFavorite);
  }

  constructor(
    private confirmService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private scriptService: ScriptService,
  ) {
    this.activatedRoute.params.subscribe(({ id }) => {
      if (id) {
        this.getScript(id);
      }
    });
  }

  private getScript(id: number) {
    this.scriptService.getScript(id).subscribe((script) => {
      this.scriptBlocks = script.blocks;
    });
  }

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

  public onReorder([block]: Block[]) {
    const curIndex = this.scriptBlocks.findIndex((b) => b.id === block.id);
    if (curIndex < block.blockIndex) {
      for (let i = block.blockIndex; i >= curIndex; i -= 1) {
        this.scriptBlocks[i].blockIndex = i;
      }
      return;
    }
    for (let i = block.blockIndex; i <= curIndex; i += 1) {
      this.scriptBlocks[i].blockIndex = i;
    }
  }
}
