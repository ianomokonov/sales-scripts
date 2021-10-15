import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-script-tasks',
  templateUrl: './script-tasks.component.html',
  styleUrls: ['./script-tasks.component.less'],
})
export class ScriptTasksComponent {
  public showNewField = false;
  public newTaskControl = new FormControl(null, Validators.required);

  public save() {
    if (this.newTaskControl.invalid) {
      this.newTaskControl.markAsDirty();
      return;
    }
    this.showNewField = false;
  }
}
