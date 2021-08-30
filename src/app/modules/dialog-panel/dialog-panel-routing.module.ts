import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DialogPanelComponent } from './dialog-panel.component';

const routes: Routes = [
  {
    path: '',
    component: DialogPanelComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DialogPanelRoutingModule {}
