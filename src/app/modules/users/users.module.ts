import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OrganizerLoginComponent } from './components/organizer-login/organizer-login.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { ChampionshipViewComponent } from './pages/championship-view/championship-view.component';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { TrainerLoginComponent } from './components/trainer-login/trainer-login.component';
import { ResponsibleLoginComponent } from './components/responsible-login/responsible-login.component';
import { BracketViwerComponent } from './pages/bracket-viwer/bracket-viwer.component';

import { EightParticipantsBracketComponent } from './components/eight-participants-bracket/eight-participants-bracket.component';
import { TwoParticipantsBracketComponent } from './components/two-participants-bracket/two-participants-bracket.component';
import { FourParticipantsBracketComponent } from './components/four-participants-bracket/four-participants-bracket.component';
import { SixteenParticipantsBracketComponent } from './components/sixteen-participants-bracket/sixteen-participants-bracket.component';
import { NineParticipantsBracketComponent } from './components/nine-participants-bracket/nine-participants-bracket.component';
import { FiveParticipantsBracketComponent } from './components/five-participants-bracket/five-participants-bracket.component';
import { SixParticipantsBracketComponent } from './components/six-participants-bracket/six-participants-bracket.component';
import { SevenParticipantsBracketComponent } from './components/seven-participants-bracket/seven-participants-bracket.component';
import { FifteenParticipantsBracketComponent } from './components/fifteen-participants-bracket/fifteen-participants-bracket.component';
import { FourteenParticipantsBracketComponent } from './components/fourteen-participants-bracket/fourteen-participants-bracket.component';
import { ThirteenParticipantsBracketComponent } from './components/thirteen-participants-bracket/thirteen-participants-bracket.component';
import { TwelveParticipantsBracketComponent } from './components/twelve-participants-bracket/twelve-participants-bracket.component';
import { ElevenParticipantsBracketComponent } from './components/eleven-participants-bracket/eleven-participants-bracket.component';
import { TenParticipantsBracketComponent } from './components/ten-participants-bracket/ten-participants-bracket.component';
import { ThreeParticipantsBracketComponent } from './components/three-participants-bracket/three-participants-bracket.component';
import { BracketDownloadComponent } from './pages/bracket-download/bracket-download.component';
@NgModule({
  declarations: [
    OrganizerLoginComponent,
    MainPageComponent,
    ChampionshipViewComponent,
    LoginComponent,
    TrainerLoginComponent,
    ResponsibleLoginComponent,
    BracketViwerComponent,

    TwoParticipantsBracketComponent,
    EightParticipantsBracketComponent,
    FourParticipantsBracketComponent,
    SixteenParticipantsBracketComponent,
    NineParticipantsBracketComponent,
    FiveParticipantsBracketComponent,
    SixParticipantsBracketComponent,
    SevenParticipantsBracketComponent,
    FifteenParticipantsBracketComponent,
    FourteenParticipantsBracketComponent,
    ThirteenParticipantsBracketComponent,
    TwelveParticipantsBracketComponent,
    ElevenParticipantsBracketComponent,
    TenParticipantsBracketComponent,

    ThreeParticipantsBracketComponent,
    BracketDownloadComponent,
  ],
  imports: [CommonModule, FormsModule],
  providers: [AuthService, DatePipe],
})
export class UsersModule {}
