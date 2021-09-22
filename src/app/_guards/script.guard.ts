import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ScriptService } from '../_services/back/script.service';

@Injectable()
export class ScriptGuard implements CanActivate {
  constructor(private router: Router, private scriptService: ScriptService) {}

  public canActivate(next: ActivatedRouteSnapshot): Observable<boolean> {
    return this.scriptService.canOpenScript(next.params.id).pipe(
      tap((res) => {
        if (res) {
          return true;
        }
        this.router.navigate(['/not-found']);
        return false;
      }),
      catchError((err) => {
        this.router.navigate(['/not-found']);
        return of(err);
      }),
    );
  }
}
