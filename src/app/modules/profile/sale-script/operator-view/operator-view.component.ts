/* eslint-disable no-param-reassign */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  SecurityContext,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { OverlayPanel } from 'primeng/overlaypanel';
import { forkJoin } from 'rxjs';
import { ScriptParam } from 'src/app/_entities/script-param';
import { Script } from 'src/app/_entities/script.entity';
import { IdNameResponse } from 'src/app/_models/responses/id-name.response';
import { TasksInfo } from 'src/app/_models/tasks-info';
import { TransitionType } from 'src/app/_models/transition-type';
import { BlockService } from 'src/app/_services/back/block.service';
import { ScriptService } from 'src/app/_services/back/script.service';
import { UserService } from 'src/app/_services/back/user.service';
import { LoadingService } from 'src/app/_services/front/loading.service';
import { TasksService } from 'src/app/_services/front/tasks.service';
import { convertToBreadCrumb } from '../../sale-scripts/breadCrumb.converter';
import { ScriptTasksComponent } from '../script-tasks/script-tasks.component';

@Component({
  selector: 'app-operator-view',
  templateUrl: './operator-view.component.html',
  styleUrls: ['./operator-view.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorViewComponent implements OnInit {
  @ViewChild('subMenu')
  public subMenu: OverlayPanel | undefined;
  public subMenuItems: IdNameResponse[] | undefined;
  public script: Script | undefined;
  public breadCrumbs: MenuItem[] = [];
  public params: ScriptParam[] = [];
  public shouldBlink = false;
  private blinkInterval: any;
  public talkInterval: any;
  private tickes: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private scriptService: ScriptService,
    private blockService: BlockService,
    public loadingService: LoadingService,
    private messageService: MessageService,
    private cdRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    public userService: UserService,
    private modalService: DialogService,
    public tasksService: TasksService,
  ) {}

  public ngOnInit() {
    this.activatedRoute.params.subscribe(({ id }) => {
      if (id) {
        this.getScript(id);
      }
    });

    this.setBlinkInterval();
  }

  public nextBlock(blockId: number, isLast: boolean, index?: number) {
    if (
      !this.script?.blocks?.length ||
      this.script?.blocks[this.script?.blocks.length - 1]?.id !== blockId
    ) {
      this.blockService.getBlock(blockId).subscribe((block) => {
        block.safeDescription = this.parseDescription(block.description);
        if (!isLast && index !== undefined) {
          this.script?.blocks.splice(index + 1);
        }
        this.script?.blocks.push(block);
        this.cdRef.detectChanges();

        window.scrollTo(0, document.body.scrollHeight);
      });
    }
  }

  public setNewParamValue(param: ScriptParam) {
    this.saveParams();

    document
      .querySelectorAll<HTMLInputElement>(`.param-input[data-param-id="${param.id}"]`)
      .forEach((input: HTMLInputElement) => {
        input.value = param.value || '';
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
  public getBtnLabel() {
    return this.talkInterval ? 'Завершить разговор' : 'Начать разговор';
  }

  public toggleScript() {
    if (this.talkInterval) {
      clearInterval(this.talkInterval);
      this.talkInterval = null;
      this.tickes = 0;
      // eslint-disable-next-line no-return-assign
      this.params.forEach((p) => (p.value = undefined));
      if (this.script) {
        this.getScript(this.script.id);
      }

      return;
    }

    this.talkInterval = setInterval(() => {
      this.tickes += 1000;
      this.cdRef.detectChanges();
    }, 1000);
    this.cdRef.detectChanges();
  }

  private getScript(id: number) {
    const sub = forkJoin([
      this.scriptService.getOperatorScript(id),
      this.scriptService.getScriptParams(id),
    ]).subscribe(
      ([script, params]) => {
        this.params = params;
        const savedParams = this.getStorageParams();
        if (savedParams) {
          savedParams.forEach((p) => {
            const param = this.params.find((pa) => pa.id === p.id);

            if (param) {
              param.value = p.value;
            }
          });
        }
        this.script = script;
        this.script.blocks.forEach((b) => {
          b.safeDescription = this.parseDescription(b.description);
        });
        const crumbs = convertToBreadCrumb(this.script.breadCrumbs, true);
        this.breadCrumbs = crumbs.data;
        this.subMenuItems = crumbs.crumbs;
        this.loadingService.removeSubscription(sub);
        this.cdRef.detectChanges();
      },
      ({ error }) => {
        this.loadingService.removeSubscription(sub);
        this.messageService.add({
          severity: 'error',
          detail: error.message || 'Ошибка загрузки данных',
        });
        this.cdRef.detectChanges();
      },
    );
    this.loadingService.addSubscription(sub);
  }

  public breadCrumbToggle(action: any) {
    const { originalEvent, item } = action;
    if (item.id === 'toggle') {
      this.subMenu?.toggle(originalEvent);
      this.cdRef.detectChanges();
    }
  }

  public getTime() {
    // const hh = Math.floor(this.tickes / 3600);
    // const mm = Math.floor((this.tickes % 3600) / 60);
    // const ss = this.tickes % 60;

    return new Date(this.tickes);
  }

  public onParamChange({ target }: any) {
    const input = target.closest('[data-param-id]');
    if (!input) {
      return;
    }

    const param = this.params.find((p) => p.id === +input.dataset.paramId);

    if (!param) {
      return;
    }

    param.value = target.value;
    this.setNewParamValue(param);

    this.cdRef.detectChanges();
  }

  public parseDescription(text: string): SafeHtml {
    let safeText = this.sanitizer.sanitize(SecurityContext.HTML, text);

    if (!safeText) {
      return '';
    }
    this.params.forEach((p) => {
      safeText =
        safeText?.replace(
          // eslint-disable-next-line no-useless-escape
          new RegExp(`\\{\\s*${this.sanitizer.sanitize(SecurityContext.HTML, p.name)}\\s*\}`, 'gi'),
          `<input data-param-id="${p.id}" value="${
            p.value || ''
          }" class="param-input" placeholder="${p.name}"/>`,
        ) || '';
    });
    return this.sanitizer.bypassSecurityTrustHtml(safeText);
  }

  public onOpenTasksClick() {
    if (this.blinkInterval) {
      clearInterval(this.blinkInterval);
      this.shouldBlink = false;
    }

    const modal = this.modalService.open(ScriptTasksComponent, {
      header: 'Упражнения',
      data: { scriptId: this.script?.id },
    });

    modal.onDestroy.subscribe(() => {
      this.tasksService.setTasksInfo(new TasksInfo());
      this.setBlinkInterval();
    });
  }

  private saveParams() {
    sessionStorage.setItem('scriptParams', JSON.stringify(this.params));
  }

  private getStorageParams(): ScriptParam[] {
    if (sessionStorage.getItem('scriptParams')) {
      return JSON.parse(sessionStorage.getItem('scriptParams') as string);
    }

    return [];
  }

  private setBlinkInterval() {
    this.blinkInterval = setInterval(() => {
      const blink = !!this.tasksService.tasksInfo?.shouldDoTasks();
      if (blink !== this.shouldBlink) {
        this.shouldBlink = blink;
        this.cdRef.detectChanges();
      }
    }, 1000);
  }
}
