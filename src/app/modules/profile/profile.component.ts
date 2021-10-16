import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../_services/back/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less'],
})
export class ProfileComponent {
  public isAdmin = false;

  constructor(private userService: UserService, private router: Router) {
    this.userService.checkAdmin().subscribe((response) => {
      this.isAdmin = response;
    });
  }

  public logOut() {
    this.userService.logOut().subscribe();
  }

  public checkUrl(): boolean {
    return this.router.url === '/profile/scripts-access';
  }
}
