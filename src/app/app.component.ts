import { ChangeDetectorRef, Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { LoadingService } from './_services/front/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  constructor(
    public loadingService: LoadingService,
    private cdr: ChangeDetectorRef,
    private primeConfig: PrimeNGConfig,
  ) {
    // eslint-disable-next-line no-param-reassign
    loadingService.changeDetectorRef = cdr;
    // eslint-disable-next-line no-param-reassign
    primeConfig.ripple = true;
  }
}
