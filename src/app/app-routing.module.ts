import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'panel',
    loadChildren: () =>
      import('./dialog-panel/dialog-panel.module').then((m) => m.DialogPanelModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./personal-cabinet/personal-cabinet.module').then((m) => m.PersonalCabinetModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
