import { Component, OnInit, ViewChild } from '@angular/core';
// import { debounceTime } from 'rxjs/operators';
import { DialogService } from 'primeng/dynamicdialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { FormControl } from '@angular/forms';
import { UserService } from 'src/app/_services/back/user.service';
import { ScriptService } from '../../../_services/back/script.service';
import { FolderResponse } from '../../../_models/responses/folder.response';
import { IdNameResponse } from '../../../_models/responses/id-name.response';
import { LoadingService } from '../../../_services/front/loading.service';
import { convertToBreadCrumb } from './breadCrumb.converter';
import { ScriptShortView } from '../../../_models/script-short-view';
import { ScriptOrFolderComponent } from '../_modals/script-or-folder/script-or-folder.component';

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
  public folders: IdNameResponse[] = [];
  public searchedScripts: ScriptShortView[] = [];
  private lastFolderId: number | null = null;
  public isError: boolean = false;
  public buttonItems: MenuItem[];
  public breadCrumb: MenuItem[];
  public searchControl = new FormControl();

  constructor(
    private scriptService: ScriptService,
    private router: Router,
    private route: ActivatedRoute,
    private ds: DialogService,
    private cs: ConfirmationService,
    private messageService: MessageService,
    public loadingService: LoadingService,
    public userService: UserService,
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
      this.lastFolderId = id;
      this.getFolder(id);
    });

    this.scriptService.getFolders().subscribe((folders) => {
      this.folders = folders;
    });
    this.getSearchedScripts();
    this.searchControl.valueChanges.subscribe((script: ScriptShortView) => {
      if (!script) {
        return;
      }

      if (script.isFolder) {
        this.getFolder(script.id);
        return;
      }

      document.querySelector('.p-dropdown-panel')?.remove();

      if (this.userService.user?.isAdmin) {
        this.router.navigate(['/profile', 'script', script.id, 'constructor']);
        return;
      }
      this.router.navigate(['/profile', 'script', script.id, 'operator']);
    });
  }

  public getFolder(id?: number) {
    this.searchControl.setValue(null, { emitEvent: false });
    const sub = this.scriptService.getFolder(id).subscribe(
      (response) => {
        this.items = response;
        const crumb = convertToBreadCrumb(
          this.userService.user?.isAdmin ? 'constructor' : 'operator',
          this.items.breadCrumbs,
        );
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
    const modal = this.ds.open(ScriptOrFolderComponent, {
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
    const modal = this.ds.open(ScriptOrFolderComponent, {
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
        this.router.navigate(['script', newScriptId, 'constructor'], {
          relativeTo: this.route.parent,
        });
      }
    });
  }

  public onEditClick(item: ScriptShortView) {
    const modal = this.ds.open(ScriptOrFolderComponent, {
      header: `Редактировать ${item.isFolder ? 'папку' : 'скрипт'}`,
      width: '50%',
      data: {
        folders: this.folders,
        edit: item,
      },
    });
    modal.onClose.subscribe((changedItem: ScriptShortView) => {
      if (changedItem) {
        const index = this.items.scripts.findIndex(
          (scriptsItem) => scriptsItem.id === changedItem.id,
        );
        if (this.items.scripts[index]) {
          this.items.scripts[index].name = changedItem.name;
        }
        if (item.parentFolderId !== changedItem.parentFolderId) {
          this.items.scripts.splice(index, 1);
        }
        this.messageService.add({
          severity: 'success',
          detail: `${item.isFolder ? 'Папка' : 'Скрипт'} успешно ${
            item.isFolder ? 'изменена' : 'изменен'
          }`,
        });
        this.getSearchedScripts();
      }
    });
  }

  public onDeleteClick(item: ScriptShortView) {
    this.cs.confirm({
      header: 'Подтвердите действие',
      message: `Вы уверены, что хотите удалить ${
        item.isFolder ? 'папку и все вложенные в неё папки и скрипты' : 'скрипт'
      }?`,
      acceptLabel: 'Удалить',
      acceptButtonStyleClass: 'p-button-success',
      rejectLabel: 'Отмена',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.scriptService.deleteScript(item.id).subscribe(
          (success) => {
            if (success) {
              const index = this.items.scripts.findIndex((folder) => folder.id === item.id);
              this.items.scripts.splice(index, 1);
            }
          },
          ({ error }) => {
            this.messageService.add({
              severity: 'error',
              detail: error.message,
            });
          },
        );
      },
    });
  }

  public breadCrumbToggle(action: any) {
    const { originalEvent, item } = action;
    if (item.id === 'toggle') {
      this.subMenu?.toggle(originalEvent);
    }
  }

  private getSearchedScripts() {
    this.scriptService.getScripts().subscribe((searchedScripts) => {
      this.searchedScripts = searchedScripts;
    });
  }
}
