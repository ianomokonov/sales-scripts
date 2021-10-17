export class TasksInfo {
  public startDate: Date = new Date();

  public shouldDoTasks() {
    return new Date().getTime() - this.startDate.getTime() > 60000; // 60000 - 3600000
  }

  public static fromJS(data: any): TasksInfo {
    const result = new TasksInfo();
    result.startDate = new Date(data.startDate || new Date());
    return result;
  }
}
