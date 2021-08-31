import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalCabinetComponent } from './personal-cabinet.component';
import { SaleScriptComponent } from './sale-script/sale-script.component';

const routes: Routes = [
  {
    path: '',
    component: PersonalCabinetComponent,
    children: [
      {
        path: 'script/:id',
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
