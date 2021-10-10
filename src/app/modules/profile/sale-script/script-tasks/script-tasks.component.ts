import { Component } from '@angular/core';

@Component({
  selector: 'app-script-tasks',
  templateUrl: './script-tasks.component.html',
  styleUrls: ['./script-tasks.component.less'],
})
export class ScriptTasksComponent {
  public showNewField = false;

  public save() {
    this.showNewField = false;
  }
}
