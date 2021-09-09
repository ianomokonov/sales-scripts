import { Injectable } from '@angular/core';
import { CanActivateChild } from '@angular/router';
import { TokenService } from '../_services/front/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivateChild {
  constructor(private tokenService: TokenService) {}

  public canActivateChild(): boolean {
    return !!this.tokenService.getToken();
  }
}
