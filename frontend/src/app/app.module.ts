import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ActivateComponent } from './components/activate/activate.component';
import { ChannelsComponent } from './components/channels/channels.component';
import { CreateServerPopupComponent } from './components/popups/create-server-popup/create-server-popup.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        RegisterComponent,
        LoginComponent,
        NavbarComponent,
        ActivateComponent,
        ChannelsComponent,
        CreateServerPopupComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        HttpClientXsrfModule,
        DialogModule,
        ButtonModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
