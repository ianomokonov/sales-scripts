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
import { EditorModule } from 'primeng/editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { MenubarModule } from 'primeng/menubar';
import { ScriptGuard } from 'src/app/_guards/script.guard';
import { PersonalCabinetRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { SaleScriptComponent } from './sale-script/sale-script.component';
import { SaleScriptsComponent } from './sale-scripts/sale-scripts.component';
import { AddTransitionComponent } from './sale-script/add-transition/add-transition.component';
import { AddBlockComponent } from './sale-script/add-block/add-block.component';
import { ScriptOrFolderComponent } from './_modals/script-or-folder/script-or-folder.component';
import { OperatorViewComponent } from './sale-script/operator-view/operator-view.component';
import { ConstructorComponent } from './sale-script/constructor/constructor.component';

@NgModule({
  declarations: [
    ProfileComponent,
    SaleScriptComponent,
    SaleScriptsComponent,
    AddTransitionComponent,
    AddBlockComponent,
    ScriptOrFolderComponent,
    AddBlockComponent,
    OperatorViewComponent,
    ConstructorComponent,
  ],
  imports: [
    CommonModule,
    PersonalCabinetRoutingModule,
    DividerModule,
    DynamicDialogModule,
    InputTextareaModule,
    ButtonModule,
    RadioButtonModule,
    AccordionModule,
    ConfirmDialogModule,
    OrderListModule,
    TreeModule,
    InputTextModule,
    DropdownModule,
    ReactiveFormsModule,
    FormsModule,
    SelectButtonModule,
    EditorModule,
    TableModule,
    CardModule,
    SplitButtonModule,
    MenuModule,
    RippleModule,
    BreadcrumbModule,
    OverlayPanelModule,
    ScrollPanelModule,
    MenubarModule,
  ],
  providers: [ConfirmationService, ScriptService, DialogService, BlockService, ScriptGuard],
})
export class ProfileModule {}
