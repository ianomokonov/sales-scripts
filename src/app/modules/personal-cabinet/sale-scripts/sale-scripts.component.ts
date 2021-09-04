import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ScriptShortView } from 'src/app/_models/script-short-view';
import { ActivatedRoute, Router } from '@angular/router';
import { ScriptService } from '../../../_services/back/script.service';
import { scriptToTreeNodeFormatter } from './scriptToTreeNodeFormatter';
import { AddFolderComponent } from '../_modals/add-folder/add-folder.component';
import { AddScriptComponent } from '../_modals/add-script/add-script.component';

@Component({
  selector: 'app-sale-scripts',
  templateUrl: './sale-scripts.component.html',
  styleUrls: ['./sale-scripts.component.less'],
})
export class SaleScriptsComponent implements OnInit {
  public treeData: TreeNode[] = [];
  private scripts: ScriptShortView[] = [];
  private folders: ScriptShortView[] = [];

  constructor(
    private scriptService: ScriptService,
    private router: Router,
    private route: ActivatedRoute,
    private ds: DialogService,
  ) {}

  ngOnInit(): void {
    this.scriptService.getScripts().subscribe((scripts) => {
      this.scripts = scripts;
      this.folders = this.scripts.filter((item) => item.isFolder);
      this.treeData = scriptToTreeNodeFormatter(this.scripts);
    });
  }

  public toggle(node: TreeNode) {
    // eslint-disable-next-line no-param-reassign
    node.expanded = !node.expanded;
  }

  public addFolder() {
    const modal = this.ds.open(AddFolderComponent, {
      header: 'Добавить папку',
      width: '70%',
      data: this.folders,
    });

    modal.onClose.subscribe((newFolder) => {
      if (newFolder) {
        this.scripts.push(newFolder);
        this.treeData = scriptToTreeNodeFormatter(this.scripts);
      }
    });
  }

  public addScript() {
    const modal = this.ds.open(AddScriptComponent, {
      header: 'Добавить скрипт',
      width: '70%',
      data: this.folders,
    });

    modal.onClose.subscribe((newScriptId) => {
      if (newScriptId) {
        this.router.navigate([newScriptId], { relativeTo: this.route });
      }
    });
  }
}
