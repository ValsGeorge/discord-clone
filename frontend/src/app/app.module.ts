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
import { ServersComponent } from './components/servers/servers.component';
import { CreateServerPopupComponent } from './components/popups/create-server-popup/create-server-popup.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { ServerDetailsComponent } from './components/server-details/server-details.component';
import { ServersSidePanelComponent } from './components/servers-side-panel/servers-side-panel.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { ChannelsComponent } from './components/channels/channels.component';
import { FormsModule } from '@angular/forms';
import { CreateChannelPopupComponent } from './components/popups/create-channel-popup/create-channel-popup.component';
import { ChatComponent } from './components/chat/chat.component';
import { JoinServerComponent } from './components/join-server/join-server.component';
import { EditMenuComponent } from './components/edit-menu/edit-menu.component';
import { ContextMenuModule } from 'primeng/contextmenu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageOptionsComponent } from './components/message-options/message-options.component';
import { OnlineUsersComponent } from './components/online-users/online-users.component';
import { OpenUserInfoDetailsComponent } from './components/popups/open-user-info-details/open-user-info-details.component';
import { DirectMessagesComponent } from './components/direct-messages/direct-messages.component';
import { ChatDmComponent } from './components/chat-dm/chat-dm.component';
import { FriendsComponent } from './components/friends/friends.component';
import { DatePipe } from '@angular/common';
import { CustomDatePipe } from './models/custom.datepipe';
import { ServerNamePipe } from './pipes/server-name.pipe';
import { ServerNameOptionsComponent } from './components/server-name-options/server-name-options.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        RegisterComponent,
        LoginComponent,
        NavbarComponent,
        ActivateComponent,
        ServersComponent,
        CreateServerPopupComponent,
        ServerDetailsComponent,
        UserInfoComponent,
        ChannelsComponent,
        CreateChannelPopupComponent,
        ChatComponent,
        JoinServerComponent,
        EditMenuComponent,
        ServersSidePanelComponent,
        MessageOptionsComponent,
        OnlineUsersComponent,
        OpenUserInfoDetailsComponent,
        DirectMessagesComponent,
        ChatDmComponent,
        FriendsComponent,
        CustomDatePipe,
        ServerNamePipe,
        ServerNameOptionsComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        HttpClientXsrfModule,
        DialogModule,
        ButtonModule,
        RouterModule.forRoot([]),
        FormsModule,
        ContextMenuModule,
        BrowserAnimationsModule,
    ],
    providers: [DatePipe],
    bootstrap: [AppComponent],
})
export class AppModule {}
