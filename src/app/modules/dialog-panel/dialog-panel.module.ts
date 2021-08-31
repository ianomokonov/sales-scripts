import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogPanelRoutingModule } from './dialog-panel-routing.module';
import { DialogPanelComponent } from './dialog-panel.component';

@NgModule({
  declarations: [DialogPanelComponent],
  imports: [CommonModule, DialogPanelRoutingModule],
})
export class DialogPanelModule {}
