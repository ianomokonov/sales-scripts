import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonalCabinetRoutingModule } from './personal-cabinet-routing.module';
import { PersonalCabinetComponent } from './personal-cabinet.component';
import { SaleScriptComponent } from './sale-script/sale-script.component';

@NgModule({
  declarations: [PersonalCabinetComponent, SaleScriptComponent],
  imports: [CommonModule, PersonalCabinetRoutingModule],
})
export class PersonalCabinetModule {}
