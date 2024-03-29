import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ActivateComponent } from './components/activate/activate.component';
import { ServersComponent } from './components/servers/servers.component';
import { ServerDetailsComponent } from './components/server-details/server-details.component';
import { ChatComponent } from './components/chat/chat.component';
import { JoinServerComponent } from './components/join-server/join-server.component';
import { ChatDmComponent } from './components/chat-dm/chat-dm.component';
import { FriendsComponent } from './components/friends/friends.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'activate/:uidb64/:token', component: ActivateComponent },
    {
        path: 'servers',
        component: ServersComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'chat-dm/:userId', component: ChatDmComponent },
            // {
            //     path: ':id',
            //     component: ServerDetailsComponent,
            //     children: [
            //         { path: 'channels/:channelId', component: ChatComponent },
            //     ],
            // },
            { path: 'join-server/:inviteCode', component: JoinServerComponent },
            { path: '', component: FriendsComponent },
        ],
    },
    {
        path: 'servers/:id',
        component: ServerDetailsComponent,
        canActivate: [AuthGuard],
        children: [{ path: 'channels/:channelId', component: ChatComponent }],
    },
    // { path: 'servers/join-server/:inviteCode', component: JoinServerComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
