import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ScriptService } from '../../../_services/back/script.service';
import { AddScriptOrFolderComponent } from '../_modals/add-script-or-folder/add-script-or-folder.component';
import { FolderResponse } from '../../../_models/responses/folder.response';
import { IdNameResponse } from '../../../_models/responses/id-name.response';
import { LoadingService } from '../../../_services/front/loading.service';
import { convertToBreadCrumb } from './breadCrumb.converter';

@Component({
  selector: 'app-sale-scripts',
  templateUrl: './sale-scripts.component.html',
  styleUrls: ['./sale-scripts.component.less'],
})
export class SaleScriptsComponent implements OnInit {
  @ViewChild('subMenu')
  public subMenu: OverlayPanel | undefined;
  public subMenuItems: IdNameResponse[] | undefined;
  public items: FolderResponse = { scripts: [] };
  private folders: IdNameResponse[] = [];
  private lastFolderId: number | null = null;
  public isError: boolean = false;
  public buttonItems: MenuItem[];
  public breadCrumb: MenuItem[];

  constructor(
    private scriptService: ScriptService,
    private router: Router,
    private route: ActivatedRoute,
    private ds: DialogService,
    private messageService: MessageService,
    private loadingService: LoadingService,
  ) {
    this.buttonItems = [
      {
        label: 'Папку',
        icon: 'pi pi-folder',
        command: () => {
          this.addFolder();
        },
      },
      {
        label: 'Скрипт',
        icon: 'pi pi-file',
        command: () => {
          this.addScript();
        },
      },
    ];
    this.breadCrumb = [
      {
        icon: 'pi pi-home',
        routerLink: ['/profile', 'scripts'],
      },
    ];
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const { id } = params;
      if (id) {
        this.lastFolderId = id;
        this.getFolder(id);
      } else {
        this.getFolder();
      }
      this.scriptService.getFolders().subscribe((folders) => {
        this.folders = folders;
      });
    });
  }

  public getFolder(id?: number) {
    const sub = this.scriptService.getFolder(id).subscribe(
      (response) => {
        this.items = response;
        const crumb = convertToBreadCrumb(this.items.breadCrumbs);
        this.breadCrumb = crumb.data;
        this.subMenuItems = crumb.crumbs;
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

  public addFolder() {
    const modal = this.ds.open(AddScriptOrFolderComponent, {
      header: 'Добавить папку',
      width: '50%',
      data: {
        folders: this.folders,
        isFolder: true,
        currentFolder: this.lastFolderId,
      },
    });

    modal.onClose.subscribe((folderId: number) => {
      if (folderId) {
        this.router.navigate(['scripts', folderId], { relativeTo: this.route.parent });
      }
    });
  }

  public addScript() {
    const modal = this.ds.open(AddScriptOrFolderComponent, {
      header: 'Добавить скрипт',
      width: '50%',
      data: {
        folders: this.folders,
        isFolder: false,
        currentFolder: this.lastFolderId,
      },
    });

    modal.onClose.subscribe((newScriptId: number) => {
      if (newScriptId) {
        this.router.navigate(['script', newScriptId], { relativeTo: this.route.parent });
      }
    });
  }

  public breadCrumbToggle(action: any) {
    const { originalEvent, item } = action;
    if (item.id === 'toggle') {
      this.subMenu?.toggle(originalEvent);
    }
  }
}
