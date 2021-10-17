import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TasksService } from 'src/app/_services/front/tasks.service';
import { TokenService } from 'src/app/_services/front/token.service';
import { UserService } from '../../_services/back/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less'],
})
export class ProfileComponent {
  public isAdmin = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private tokenService: TokenService,
    private tasksService: TasksService,
  ) {
    this.userService.checkAdmin().subscribe((response) => {
      this.isAdmin = response;
    });
    if (this.tokenService.getToken() && !userService.user) {
      this.userService.getUserInfo().subscribe();
    }
    this.tasksService.getTasksInfo();
  }

  public logOut() {
    this.userService.logOut().subscribe();
  }

  public checkUrl(): boolean {
    return this.router.url === '/profile/scripts-access';
  }
}
