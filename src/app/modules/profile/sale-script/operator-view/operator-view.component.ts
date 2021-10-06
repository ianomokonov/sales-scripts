import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Block } from 'src/app/_entities/block.entity';
import { Script } from 'src/app/_entities/script.entity';
import { IdNameResponse } from 'src/app/_models/responses/id-name.response';
import { TransitionType } from 'src/app/_models/transition-type';
import { BlockService } from 'src/app/_services/back/block.service';
import { ScriptService } from 'src/app/_services/back/script.service';
import { LoadingService } from 'src/app/_services/front/loading.service';
import { convertToBreadCrumb } from '../../sale-scripts/breadCrumb.converter';

@Component({
  selector: 'app-operator-view',
  templateUrl: './operator-view.component.html',
  styleUrls: ['./operator-view.component.less'],
})
export class OperatorViewComponent implements OnInit {
  @ViewChild('subMenu')
  public subMenu: OverlayPanel | undefined;
  public subMenuItems: IdNameResponse[] | undefined;
  public script: Script | undefined;
  public breadCrumbs: MenuItem[] = [];
  public blocks: IdNameResponse[] = [];

  /** Список отмеченных блоков */
  public get favoriteBlocks(): Block[] {
    return this.script?.blocks.filter((b) => b.isFavorite) || [];
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private scriptService: ScriptService,
    private blockService: BlockService,
    public loadingService: LoadingService,
    private messageService: MessageService,
    private cdRef: ChangeDetectorRef,
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

  public nextBlock(blockId: number) {
    if (
      !this.script?.blocks?.length ||
      this.script?.blocks[this.script?.blocks.length - 1]?.id !== blockId
    ) {
      this.blockService.getBlock(blockId).subscribe((block) => {
        this.script?.blocks.push(block);
        this.cdRef.detectChanges();

        document.querySelector('.block-tab:last-child')?.scrollIntoView();
      });
    }
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
    const sub = this.scriptService.getOperatorScript(id).subscribe(
      (script) => {
        this.script = script;
        const crumbs = convertToBreadCrumb(this.script.breadCrumbs, true);
        this.breadCrumbs = crumbs.data;
        this.subMenuItems = crumbs.crumbs;
        this.loadingService.removeSubscription(sub);
      },
      ({ error }) => {
        this.loadingService.removeSubscription(sub);
        this.messageService.add({
          severity: 'error',
          detail: error.message || 'Ошибка загрузки данных',
        });
      },
    );
    this.loadingService.addSubscription(sub);
  }

  public breadCrumbToggle(action: any) {
    const { originalEvent, item } = action;
    if (item.id === 'toggle') {
      this.subMenu?.toggle(originalEvent);
    }
  }
}
