import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TreeNode } from 'primeng/api';
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

  constructor(private userService: UserService, private scriptService: ScriptService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data: User[]) => {
      this.users = data;
    });
    this.scriptService.getScripts().subscribe((data: ScriptShortView[]) => {
      this.scripts = data;
      this.treeData = this.getScriptsTree(data);
    });
  }

  private getScriptsTree(data: ScriptShortView[]): TreeNode[] {
    const tree: TreeNode[] = [];
    data.forEach((elem) => {
      if (this.usersScriptsIds.includes(elem.id)) {
        this.selectedElems.push({
          key: elem.id.toString(),
          label: elem.name,
          children: this.getChildrenTree(elem.id),
        });
      }
      if (!elem.parentFolderId) {
        tree.push({
          key: elem.id.toString(),
          label: elem.name,
          children: this.getChildrenTree(elem.id),
        });
      }
    });
    return tree;
  }

  private getChildrenTree(id: number): TreeNode[] {
    const childTree: TreeNode[] = [];
    const children = this.scripts.filter((sc) => sc.parentFolderId == id);
    if (children?.length) {
      children.forEach((child) => {
        childTree.push({
          key: child.id.toString(),
          label: child.name,
          children: this.getChildrenTree(child.id),
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
      .addAccess(
        this.userFormControl.value,
        this.selectedElems.map((e: any) => e.key),
      )
      .subscribe();
  }

  public selectElems(event: any) {
    this.usersScriptsIds = this.users.find((u) => u.id === event)?.scriptIds || [];
    this.getScriptsTree(this.scripts);
  }
}
