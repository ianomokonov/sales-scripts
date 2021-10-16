import { Component } from '@angular/core';
import { TasksService } from 'src/app/_services/front/tasks.service';
import { TokenService } from 'src/app/_services/front/token.service';
import { UserService } from '../../_services/back/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less'],
})
export class ProfileComponent {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private tasksService: TasksService,
  ) {
    if (this.tokenService.getToken() && !userService.user) {
      this.userService.getUserInfo().subscribe();
    }
    this.tasksService.getTasksInfo();
  }

  public logOut() {
    this.userService.logOut().subscribe();
  }
}
