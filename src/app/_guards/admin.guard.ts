import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from '../_services/back/user.service';
import { tokenKey } from '../_utils/constants';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  public canActivate(): Observable<boolean> | boolean {
    const currentUserToken = localStorage.getItem(tokenKey);
    if (currentUserToken) {
      return this.userService.checkAdmin().pipe(
        tap((res) => {
          if (res) {
            return true;
          }
          this.router.navigate(['/not-found']);
          return false;
        }),
      );
    }
    return false;
  }
}
