import { Injectable } from '@angular/core';
import { TasksInfo } from 'src/app/_models/tasks-info';
import { tasksInfoKey } from 'src/app/_utils/constants';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  public tasksInfo: TasksInfo | undefined;

  public getTasksInfo(): void {
    const tasksInfo = sessionStorage.getItem(tasksInfoKey);
    if (tasksInfo) {
      this.tasksInfo = TasksInfo.fromJS(JSON.parse(tasksInfo));
      return;
    }

    this.tasksInfo = new TasksInfo();
    this.setTasksInfo(this.tasksInfo);
  }

  public removeTasksInfo() {
    sessionStorage.removeItem(tasksInfoKey);
    this.tasksInfo = undefined;
  }

  public setTasksInfo(tasksInfo: TasksInfo) {
    this.tasksInfo = tasksInfo;
    sessionStorage.setItem(tasksInfoKey, JSON.stringify(tasksInfo));
  }
}
