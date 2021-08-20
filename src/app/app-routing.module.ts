import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './_components/sign-in/sign-in.component';
import { SignUpComponent } from './_components/sign-up/sign-up.component';

const routes: Routes = [
  {
    path: 'panel',
    loadChildren: () =>
      import('./_modules/dialog-panel/dialog-panel.module').then((m) => m.DialogPanelModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./_modules/personal-cabinet/personal-cabinet.module').then(
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
