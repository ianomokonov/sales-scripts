import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { PersonalCabinetRoutingModule } from './personal-cabinet-routing.module';
import { PersonalCabinetComponent } from './personal-cabinet.component';
import { SaleScriptComponent } from './sale-script/sale-script.component';

@NgModule({
  declarations: [PersonalCabinetComponent, SaleScriptComponent],
  imports: [
    CommonModule,
    PersonalCabinetRoutingModule,
    DividerModule,
    ButtonModule,
    AccordionModule,
  ],
})
export class PersonalCabinetModule {}
