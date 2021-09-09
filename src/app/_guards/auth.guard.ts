import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TokenService } from '../_services/front/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivateChild {
  constructor(
    private router: Router,
    private tokenService: TokenService,
    private messageService: MessageService,
  ) {}

  public canActivateChild(): boolean {
    const token = this.tokenService.getToken();
    if (!token) {
      this.messageService.add({
        severity: 'error',
        detail: 'Пожалуйста, авторизуйтесь или пройдите регистрацию',
      });
      this.router.navigate(['/sign-in']);
      return false;
    }
    return true;
  }
}
