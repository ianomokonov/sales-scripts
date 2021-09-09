import { Component } from '@angular/core';
import { UserService } from '../../_services/back/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less'],
})
export class ProfileComponent {
  constructor(private userService: UserService) {}

  public logOut() {
    this.userService.logOut().subscribe();
  }
}
