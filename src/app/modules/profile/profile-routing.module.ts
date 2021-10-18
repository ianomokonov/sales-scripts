import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from 'src/app/_guards/admin.guard';
import { ScriptGuard } from 'src/app/_guards/script.guard';
import { ProfileComponent } from './profile.component';
import { OperatorViewComponent } from './sale-script/operator-view/operator-view.component';
import { SaleScriptComponent } from './sale-script/sale-script.component';
import { SaleScriptsComponent } from './sale-scripts/sale-scripts.component';
import { ScriptAccessComponent } from './script-access/script-access.component';

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
        component: SaleScriptsComponent,
        canActivate: [ScriptGuard],
      },
      {
        path: 'script/:id/constructor',
        component: SaleScriptComponent,
        canActivate: [ScriptGuard, AdminGuard],
      },
      {
        path: 'script/:id/operator',
        component: OperatorViewComponent,
        canActivate: [ScriptGuard],
      },
      {
        path: 'scripts-access',
        component: ScriptAccessComponent,
        canActivate: [AdminGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonalCabinetRoutingModule {}
