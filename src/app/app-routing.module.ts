import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

const routes: Routes = [
  {
    path: 'panel',
    loadChildren: () =>
      import('./modules/dialog-panel/dialog-panel.module').then((m) => m.DialogPanelModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./modules/personal-cabinet/personal-cabinet.module').then(
        (m) => m.PersonalCabinetModule,
      ),
  },
  {
    path: 'sign-in',
    component: SignInComponent,
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'sign-in',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
