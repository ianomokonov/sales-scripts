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
  public tasks = [
    {
      id: 1,
      name: 'Lorem ipsum dolomnis eos distinctio quas ratione. Assumenda quod quidem nisi?',
      isDone: false,
    },
    {
      id: 2,
      name: 'Lorem ipsum dolomnis eos distinctio quas ratione. Assumenda quod quidem nisi?',
      isDone: false,
    },
    {
      id: 3,
      name: 'Lorem ipsum dolomnis eos distinctio quas ratione. Assumenda quod quidem nisi?',
      isDone: false,
    },
  ];

  public save() {
    if (this.newTaskControl.invalid) {
      this.newTaskControl.markAsDirty();
      return;
    }
    this.showNewField = false;
    this.tasks.push({
      id: this.tasks.length + 1,
      name: this.newTaskControl.value,
      isDone: false,
    });
    this.newTaskControl.reset();
  }

  public remove(id: number) {
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }
}
