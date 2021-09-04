import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { SaleScriptComponent } from './sale-script/sale-script.component';
import { SaleScriptsComponent } from './sale-scripts/sale-scripts.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: '',
        redirectTo: 'scripts',
        pathMatch: 'full',
      },
      {
        path: 'scripts',
        component: SaleScriptsComponent,
      },
      {
        path: 'scripts/:id',
        component: SaleScriptComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonalCabinetRoutingModule {}
