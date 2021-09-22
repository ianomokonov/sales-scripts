import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Block } from 'src/app/_entities/block.entity';
import { Script } from 'src/app/_entities/script.entity';
import { IdNameResponse } from 'src/app/_models/responses/id-name.response';
import { TransitionType } from 'src/app/_models/transition-type';
import { BlockService } from 'src/app/_services/back/block.service';
import { ScriptService } from 'src/app/_services/back/script.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { SaveTransitionRequest } from 'src/app/_models/requests/save-transition.request';
import { AddBlockComponent } from './add-block/add-block.component';
import { AddTransitionComponent } from './add-transition/add-transition.component';
import { LoadingService } from '../../../_services/front/loading.service';
import { convertToBreadCrumb } from '../sale-scripts/breadCrumb.converter';

@Component({
  selector: 'app-sale-script',
  templateUrl: './sale-script.component.html',
  styleUrls: ['./sale-script.component.less'],
})
export class SaleScriptComponent implements OnInit {
  @ViewChild('subMenu')
  public subMenu: OverlayPanel | undefined;
  public subMenuItems: IdNameResponse[] | undefined;
  public script: Script | undefined;
  public isError: boolean = false;
  public breadCrumbs: MenuItem[] = [];
  public blocks: IdNameResponse[] = [];

  /** Список отмеченных блоков */
  public get favoriteBlocks(): Block[] {
    return this.script?.blocks.filter((b) => b.isFavorite) || [];
  }

  constructor(
    private confirmService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private scriptService: ScriptService,
    private blockService: BlockService,
    private modalService: DialogService,
    private dialogService: DialogService,
    public loadingService: LoadingService,
    private messageService: MessageService,
  ) {}

  public ngOnInit() {
    this.activatedRoute.params.subscribe(({ id }) => {
      if (id) {
        this.getScript(id);
        this.scriptService.getBlocks(id).subscribe((blocks) => {
          this.blocks = blocks;
        });
      }
    });
  }

  public onAddTransitionClick(
    blockId: number,
    addLink: boolean = false,
    isIncomming: boolean = false,
  ) {
    const modal = this.modalService.open(AddTransitionComponent, {
      data: { addLink, blocks: this.blocks },
      width: '50%',
      header: 'Добавление перехода',
    });

    modal.onClose.subscribe((formValue: SaveTransitionRequest) => {
      if (!formValue) {
        return;
      }
      if (formValue.block && this.script) {
        // eslint-disable-next-line no-param-reassign
        formValue.block.scriptId = this.script?.id;
      }
      let prevBlockId = blockId;
      if (isIncomming && formValue.nextBlockId) {
        prevBlockId = formValue.nextBlockId;
        // eslint-disable-next-line no-param-reassign
        formValue.nextBlockId = blockId;
      }
      this.blockService.addTransition(prevBlockId, formValue).subscribe(() => {
        if (this.script) {
          this.getScript(this.script?.id);
        }
      });
    });
  }

  public getTransitionButtonClass(type: TransitionType) {
    switch (type) {
      case TransitionType.Good: {
        return 'p-button-success';
      }
      case TransitionType.Normal: {
        return 'secondary-btn';
      }
      case TransitionType.Bad: {
        return 'p-button-danger';
      }
      default: {
        return '';
      }
    }
  }

  private getScript(id: number) {
    const sub = this.scriptService.getScript(id).subscribe(
      (script) => {
        this.script = script;
        const crumbs = convertToBreadCrumb(this.script.breadCrumbs, true);
        this.breadCrumbs = crumbs.data;
        this.subMenuItems = crumbs.crumbs;
        this.loadingService.removeSubscription(sub);
      },
      ({ error }) => {
        this.isError = true;
        this.loadingService.removeSubscription(sub);
        this.messageService.add({
          severity: 'error',
          detail: error.message || 'Ошибка загрузки данных',
        });
      },
    );
    this.loadingService.addSubscription(sub);
  }

  public createBlock() {
    const modal = this.dialogService.open(AddBlockComponent, {
      header: 'Создание нового блока или группы',
      width: '50%',
    });

    modal.onClose.subscribe((block) => {
      if (!block || !this.script) {
        return;
      }

      this.blockService.addBlock({ ...block, scriptId: this.script?.id }).subscribe(() => {
        if (this.script) {
          this.getScript(this.script?.id);
        }
      });
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
        block.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 350);
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

  public breadCrumbToggle(action: any) {
    const { originalEvent, item } = action;
    if (item.id === 'toggle') {
      this.subMenu?.toggle(originalEvent);
    }
  }
}
