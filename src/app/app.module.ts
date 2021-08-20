import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './_components/sign-in/sign-in.component';
import { SignUpComponent } from './_components/sign-up/sign-up.component';

@NgModule({
  declarations: [AppComponent, SignInComponent, SignUpComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    InputTextModule,
    FormsModule,
    CardModule,
    ButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
