import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Block } from 'src/app/_entities/block.entity';
import { Script } from 'src/app/_entities/script.entity';
import { BlockService } from 'src/app/_services/back/block.service';
import { ScriptService } from 'src/app/_services/back/script.service';

@Component({
  selector: 'app-sale-script',
  templateUrl: './sale-script.component.html',
  styleUrls: ['./sale-script.component.less'],
})
export class SaleScriptComponent {
  public script: Script | undefined;

  /** Список отмеченных блоков */
  public get favoriteBlocks(): Block[] {
    return this.script?.blocks.filter((b) => b.isFavorite) || [];
  }

  constructor(
    private confirmService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private scriptService: ScriptService,
    private blockService: BlockService,
  ) {
    this.activatedRoute.params.subscribe(({ id }) => {
      if (id) {
        this.getScript(id);
      }
    });
  }

  private getScript(id: number) {
    this.scriptService.getScript(id).subscribe((script) => {
      this.script = script;
    });
  }

  public onRemoveBlock(id: number, event: MouseEvent, index: number) {
    event.stopPropagation();

    this.confirmService.confirm({
      message: 'Удалить блок из скрипта?',
      acceptLabel: 'Да',
      rejectLabel: 'Нет',
      header: 'Удаление блока',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (!this.script) {
          return;
        }

        this.script.blocks = this.script.blocks.filter((b) => b.id !== id);
        const result: any[] = [];
        for (let i = this.script.blocks.length - 1; i >= index; i -= 1) {
          this.script.blocks[i].blockIndex = i;
          result.push({ id: this.script.blocks[i].id, index: this.script.blocks[i].blockIndex });
        }
        this.blockService.delete(id).subscribe(() => {
          if (!this.script) {
            return;
          }
          this.scriptService.reorderBlocks(this.script.id, result).subscribe();
        });
      },
    });
  }

  public onMarkBlock(id: number, event: MouseEvent) {
    const block = this.script?.blocks.find((b) => b.id === id);
    if (!block || !this.script) {
      return;
    }

    event.stopPropagation();
    block.isFavorite = !block.isFavorite;
    this.blockService.markFavorite(id, block.isFavorite, this.script.id).subscribe();
  }

  public onMarkedBlockClick(id: number) {
    const markedBlock = this.script?.blocks.find((b) => b.id === id);
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
    if (!this.script) {
      return;
    }
    const result = [];
    const curIndex = this.script.blocks.findIndex((b) => b.id === block.id);
    if (curIndex < block.blockIndex) {
      for (let i = block.blockIndex; i >= curIndex; i -= 1) {
        this.script.blocks[i].blockIndex = i;
        result.push({ id: this.script.blocks[i].id, index: this.script.blocks[i].blockIndex });
      }
    } else {
      for (let i = block.blockIndex; i <= curIndex; i += 1) {
        this.script.blocks[i].blockIndex = i;
        result.push({ id: this.script.blocks[i].id, index: this.script.blocks[i].blockIndex });
      }
    }

    this.scriptService.reorderBlocks(this.script.id, result).subscribe();
  }
}
