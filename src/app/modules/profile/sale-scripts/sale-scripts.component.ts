import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ScriptShortView } from 'src/app/_models/script-short-view';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MenuItem } from 'primeng/api';
import { ScriptService } from '../../../_services/back/script.service';
import { AddScriptOrFolderComponent } from '../_modals/add-script-or-folder/add-script-or-folder.component';
import { FolderResponse } from '../../../_models/responses/folder.response';
import { IdNameResponse } from '../../../_models/responses/id-name.response';

@Component({
  selector: 'app-sale-scripts',
  templateUrl: './sale-scripts.component.html',
  styleUrls: ['./sale-scripts.component.less'],
})
export class SaleScriptsComponent implements OnInit {
  public items: FolderResponse | undefined;
  private folders: IdNameResponse[] = [];
  private lastFolderId: number | null = null;
  public buttonItems: MenuItem[];

  constructor(
    private scriptService: ScriptService,
    private router: Router,
    private route: ActivatedRoute,
    private ds: DialogService,
    private titleService: Title,
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
    });
    this.scriptService.getFolders().subscribe((folders) => {
      this.folders = folders;
    });
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
        this.getFolder(folderId);
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

  public navigate(item?: ScriptShortView, id?: number) {
    if (item) {
      if (item.isFolder) {
        this.router.navigate(['scripts', item.id], { relativeTo: this.route.parent });
      } else {
        this.router.navigate(['script', item.id], { relativeTo: this.route.parent });
      }
    } else if (id) {
      this.router.navigate(['scripts', id], { relativeTo: this.route.parent });
    } else {
      this.router.navigate(['scripts'], { relativeTo: this.route.parent });
    }
  }

  public getFolder(id?: number) {
    this.scriptService.getFolder(id).subscribe((response) => {
      this.items = response;
      this.titleService.setTitle(this.items.name ? this.items.name : 'Скрипты продаж');
    });
  }
}
