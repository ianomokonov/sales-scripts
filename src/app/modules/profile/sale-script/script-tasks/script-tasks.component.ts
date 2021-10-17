import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserTask } from 'src/app/_entities/user-task';
import { UserService } from 'src/app/_services/back/user.service';

@Component({
  selector: 'app-script-tasks',
  templateUrl: './script-tasks.component.html',
  styleUrls: ['./script-tasks.component.less'],
})
export class ScriptTasksComponent {
  public showNewField = false;
  public newTaskControl = new FormControl(null, Validators.required);
  public tasks: UserTask[];

  constructor(private userService: UserService) {
    this.tasks = this.userService.tasks || [];
  }

  public save() {
    if (this.newTaskControl.invalid) {
      this.newTaskControl.markAsDirty();
      return;
    }

    this.userService.addUserTask(this.newTaskControl.value).subscribe((id) => {
      this.tasks.push({
        id,
        name: this.newTaskControl.value,
        isDone: false,
      });
      this.showNewField = false;
      this.newTaskControl.reset();
    });
  }

  public remove(id: number) {
    this.userService.removeUserTask(id).subscribe(() => {
      this.tasks = this.tasks.filter((t) => t.id !== id);
    });
  }
}
