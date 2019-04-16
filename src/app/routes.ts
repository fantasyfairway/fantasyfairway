import {Routes} from '@angular/router';

import { LandingComponent } from './landing/landing.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PlayerComponent } from './player/player.component';
import { LeagueComponent } from './league/league.component';
import { UsersComponent } from './users/users.component';
import { ProfileComponent } from './profile/profile.component';
import { NavbarComponent } from './navbar/navbar.component';
import {LoginComponent} from './login/login.component';
import { SignupComponent } from "./signup/signup.component";
import { LeaguechatComponent } from "./leaguechat/leaguechat.component";
import { HelpComponent } from './help/help.component';
import { PastTournamentsComponent } from "./past-tournaments/past-tournaments.component"
import { AuthGuard } from './auth.guard';
import { AdminGuard } from './admin.guard';


export const appRoutes: Routes = [
    { path: "navbar", component: NavbarComponent },
    { path: "landing", component: LandingComponent },
    { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard] },
    { path: "player", component: PlayerComponent, canActivate: [AuthGuard] },
    { path: "league", component: LeagueComponent, canActivate: [AuthGuard] },
    { path: "admin", component: UsersComponent, canActivate: [AdminGuard] },
    { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
    { path: "login", component: LoginComponent },
    { path: "signup", component: SignupComponent },
    { path: "tournaments", component: PastTournamentsComponent },
    { path: "leaguechat", component: LeaguechatComponent, canActivate: [AuthGuard] },
    { path: "help", component: HelpComponent },
    { path: "**", redirectTo: "landing", pathMatch: "full" }
];

