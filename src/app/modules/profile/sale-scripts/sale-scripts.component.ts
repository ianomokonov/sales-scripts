import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ScriptShortView } from 'src/app/_models/script-short-view';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
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

  constructor(
    private scriptService: ScriptService,
    private router: Router,
    private route: ActivatedRoute,
    private ds: DialogService,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    this.lastFolderId = Number(sessionStorage.getItem('lastFolderId'));
    this.getFolder();
    this.scriptService.getFolders().subscribe((folders) => {
      this.folders = folders;
    });
  }

  public addFolder() {
    const modal = this.ds.open(AddScriptOrFolderComponent, {
      header: 'Добавить папку',
      width: '70%',
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
      width: '70%',
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

  public navigate(item: ScriptShortView) {
    if (item.isFolder) {
      this.getFolder(item.id);
      this.lastFolderId = item.id;
    } else {
      this.router.navigate(['script', item.id], { relativeTo: this.route.parent });
      if (item.parentFolderId)
        sessionStorage.setItem('lastFolderId', item.parentFolderId.toString());
    }
  }

  public getFolder(id?: number) {
    if (!id && this.lastFolderId) {
      // eslint-disable-next-line no-param-reassign
      id = this.lastFolderId;
      sessionStorage.removeItem('lastFolderId');
    }
    this.scriptService.getFolder(id).subscribe((response) => {
      this.items = response;
      this.titleService.setTitle(this.items.name ? this.items.name : 'Скрипты продаж');
    });
  }

  public previousFolder(id?: number) {
    if (id) {
      this.lastFolderId = id;
    } else {
      this.lastFolderId = null;
    }
    this.getFolder(id);
  }
}
