import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { PlatformLocation, CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PlayerFilterPipe } from './player/player-filter.pipe'
import { AppComponent } from './app.component';
import { TablelayoutComponent } from './tablelayout/tablelayout.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { LeagueComponent } from './league/league.component';
import { LandingComponent } from './landing/landing.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { ProfileComponent } from './profile/profile.component';
import { appRoutes } from './routes';
import { PlayerComponent } from './player/player.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { LeaguechatComponent } from './leaguechat/leaguechat.component';
import { HelpComponent } from './help/help.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from './shared/services/user.service';
import { BaseService } from './shared/services/base.service';
import { HttpModule } from '@angular/http';
import { ConfigService } from './shared/utils/config.service';
import { AuthGuard } from './auth.guard';
import { ProfileService } from './shared/services/profile.service';
import { LeagueService } from './shared/services/league.service';
import { ModalService } from './shared/services/modal.service';
import { DomService } from './shared/services/dom.service';
import { PlayerService } from './shared/services/player.service';
import { TournamentService } from './shared/services/tournament.service';
import { TeamService } from './shared/services/team.service';
import { ConnectionService } from './connection.service';
import { PastTournamentsComponent } from './past-tournaments/past-tournaments.component';
import { AdminGuard } from './admin.guard';
import { EmailValidator } from './directives/email.validator.directive';
import { myFocus } from './directives/focus.directive';


@NgModule({
   declarations: [
      AppComponent,
      PlayerFilterPipe,
      TablelayoutComponent,
      NavbarComponent,
      LeaderboardComponent,
      LeagueComponent,
      LandingComponent,
      DashboardComponent,
      UsersComponent,
      ProfileComponent,
      PlayerComponent,
      LoginComponent,
      SignupComponent,
      LeaguechatComponent,
      HelpComponent,
      PastTournamentsComponent,
      EmailValidator,
      myFocus
   ],
   imports: [
      BrowserModule,
      CommonModule,
      HttpModule,
      HttpClientModule,
      RouterModule.forRoot(appRoutes, { useHash: true }),
      NgbModule,
      FormsModule,
      ReactiveFormsModule
   ],
   providers: [UserService, ConfigService, AuthGuard, AdminGuard, ProfileService, 
               LeagueService, ModalService, DomService, PlayerService, TournamentService, TeamService],
   entryComponents:[
    ],
   bootstrap: [
      AppComponent,
      NavbarComponent,
      LeaderboardComponent,
      PlayerComponent,
      ProfileComponent,
      LeagueComponent,
      UsersComponent,
      DashboardComponent,
      LoginComponent,
      SignupComponent,
      UsersComponent
   ]
})
export class AppModule { }