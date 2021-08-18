import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { PanelModule } from 'primeng/panel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, PanelModule, ButtonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
