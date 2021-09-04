import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { OrderListModule } from 'primeng/orderlist';
import { ScriptService } from 'src/app/_services/back/script.service';
import { BlockService } from 'src/app/_services/back/block.service';
import { TreeModule } from 'primeng/tree';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonalCabinetRoutingModule } from './personal-cabinet-routing.module';
import { PersonalCabinetComponent } from './personal-cabinet.component';
import { SaleScriptComponent } from './sale-script/sale-script.component';
import { SaleScriptsComponent } from './sale-scripts/sale-scripts.component';
import { AddScriptOrFolderComponent } from './_modals/add-script-or-folder/add-script-or-folder.component';

@NgModule({
  declarations: [
    PersonalCabinetComponent,
    SaleScriptComponent,
    SaleScriptsComponent,
    AddScriptOrFolderComponent,
  ],
  imports: [
    CommonModule,
    PersonalCabinetRoutingModule,
    DividerModule,
    DynamicDialogModule,
    ButtonModule,
    AccordionModule,
    ConfirmDialogModule,
    OrderListModule,
    TreeModule,
    InputTextModule,
    DropdownModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [ConfirmationService, ScriptService, DialogService, BlockService],
})
export class PersonalCabinetModule {}
