import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonalCabinetRoutingModule } from './personal-cabinet-routing.module';
import { PersonalCabinetComponent } from './personal-cabinet.component';

@NgModule({
  declarations: [PersonalCabinetComponent],
  imports: [CommonModule, PersonalCabinetRoutingModule],
})
export class PersonalCabinetModule {}
