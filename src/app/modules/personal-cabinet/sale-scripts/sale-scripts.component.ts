import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ScriptService } from '../../../_services/back/script.service';
import { scriptToTreeNodeFormatter } from './scriptToTreeNodeFormatter';
import { Script } from '../../../_entities/script.entity';
import { scriptsMock } from './scripts.mock';
import { AddFolderComponent } from '../_modals/add-folder/add-folder.component';
import { AddScriptComponent } from '../sale-script/add-script/add-script.component';

@Component({
  selector: 'app-sale-scripts',
  templateUrl: './sale-scripts.component.html',
  styleUrls: ['./sale-scripts.component.less'],
})
export class SaleScriptsComponent implements OnInit {
  public treeData: TreeNode[] = [];
  private scripts: Script[] = scriptsMock;

  constructor(private scriptService: ScriptService, private ds: DialogService) {}

  ngOnInit(): void {
    // TODO [ volik25 | 02.09.2021 ]:
    //  Удалить моку и раскомментировать запрос
    //  на сервер после введения бэка в эксплуатацию
    this.treeData = scriptToTreeNodeFormatter(this.scripts);
    // this.scriptService.getScripts().subscribe((scripts) => {
    //   this.scripts = scripts;
    //   this.data = scriptToTreeNodeFormatter(this.scripts);
    // });
  }

  public toggle(node: TreeNode) {
    // eslint-disable-next-line no-param-reassign
    node.expanded = !node.expanded;
  }

  public addFolder() {
    const modal = this.ds.open(AddFolderComponent, {
      header: 'Добавить папку',
      width: '70%',
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
    });

    modal.onClose.subscribe((newScript) => {
      if (newScript) {
        this.scripts.push(newScript);
        this.treeData = scriptToTreeNodeFormatter(this.scripts);
      }
    });
  }
}
