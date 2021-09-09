import { Injectable } from '@angular/core';
import { CanActivateChild, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../_services/front/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivateChild {
  constructor(private tokenService: TokenService) {}

  public canActivateChild():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = this.tokenService.getToken();
    return !!token;
  }
}
