import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MessageService, TreeNode } from 'primeng/api';
import { User } from 'src/app/_entities/user.entity';
import { ScriptShortView } from 'src/app/_models/script-short-view';
import { ScriptService } from 'src/app/_services/back/script.service';
import { UserService } from 'src/app/_services/back/user.service';

@Component({
  selector: 'app-script-access',
  templateUrl: './script-access.component.html',
  styleUrls: ['./script-access.component.less'],
})
export class ScriptAccessComponent implements OnInit {
  public userFormControl = new FormControl(null, [Validators.required]);
  public users: User[] = [];
  private usersScriptsIds: number[] = [];
  public scripts: ScriptShortView[] = [];
  public treeData: TreeNode[] = [];
  public selectedElems: TreeNode[] = [];

  constructor(
    private userService: UserService,
    private scriptService: ScriptService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.scriptService.getScripts().subscribe((data: ScriptShortView[]) => {
      this.scripts = data;
      this.treeData = this.getScriptsTree(data);
      this.selectedElems.forEach((e) => {
        e.expanded = true;
      });
    });
  }

  private getUsers() {
    this.userService.getUsers().subscribe((data: User[]) => {
      this.users = data;
    });
  }

  private getScriptsTree(data: ScriptShortView[]): TreeNode[] {
    const tree: TreeNode[] = [];
    data.forEach((elem) => {
      if (!elem.parentFolderId) {
        tree.push({
          key: elem.id.toString(),
          label: elem.name,
          children: this.getChildrenTree(elem.id, !!this.usersScriptsIds.includes(elem.id)),
          expanded: !!this.usersScriptsIds.includes(elem.id),
        });
      }
    });
    tree.forEach((tn) => {
      if (tn.key) {
        if (this.usersScriptsIds.includes(+tn.key)) {
          this.selectedElems.push(tn);
        }
      }
    });
    console.log(tree, this.selectedElems);
    return tree;
  }

  private getChildrenTree(id: number, expanded?: boolean): TreeNode[] {
    const childTree: TreeNode[] = [];
    const children = this.scripts.filter((sc) => sc.parentFolderId === id);
    if (children?.length) {
      children.forEach((child) => {
        childTree.push({
          key: child.id.toString(),
          label: child.name,
          children: this.getChildrenTree(child.id),
          expanded: !!expanded,
        });
      });
    }
    return childTree;
  }

  public addAccess() {
    if (this.userFormControl.invalid) {
      this.userFormControl.markAsDirty();
      return;
    }
    this.userService
      .setUserScripts({
        userId: this.userFormControl.value,
        scriptIds: this.selectedElems.map((e: any) => e.key),
      })
      .subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            detail: `Права успешно добавлены`,
          });
          this.getUsers();
        },
        () => {
          this.messageService.add({
            severity: 'error',
            detail: `При добавлении прав произошла ошибка`,
          });
        },
      );
  }

  public selectElems(event: any) {
    this.selectedElems = [];
    this.usersScriptsIds = this.users.find((u) => u.id === event)?.scriptIds || [];
    this.getScriptsTree(this.scripts);
  }

  public nodeSelect({ node }: any) {
    let { parent } = node;
    while (parent) {
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      if (!this.selectedElems.find((e) => e.key === parent.key)) {
        this.selectedElems.push(parent);
      }
      parent = parent.parent;
    }
  }

  public nodeUnselect({ node }: any) {
    let { parent } = node;
    while (parent) {
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      if (parent.partialSelected && !this.selectedElems.find((e) => e.key === parent.key)) {
        this.selectedElems.push(parent);
      }
      parent = parent.parent;
    }
  }
}
