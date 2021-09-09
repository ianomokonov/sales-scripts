import { ChangeDetectorRef, Component } from '@angular/core';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LoadingService } from './_services/front/loading.service';
import { UserService } from './_services/back/user.service';
import { menuModel } from './_utils/menu';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  public items: MenuItem[] = menuModel;
  public isMenuShow: boolean = false;

  constructor(
    public loadingService: LoadingService,
    private cdr: ChangeDetectorRef,
    private primeConfig: PrimeNGConfig,
    private userService: UserService,
    private router: Router,
  ) {
    // eslint-disable-next-line no-param-reassign
    loadingService.changeDetectorRef = cdr;
    // eslint-disable-next-line no-param-reassign
    primeConfig.ripple = true;
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((event) => {
        const url = event.urlAfterRedirects;
        this.isMenuShow = !(url === '/sign-in' || url === '/sign-up' || url === '/404');
      });
  }

  public logOut() {
    this.userService.logOut().subscribe();
  }
}
