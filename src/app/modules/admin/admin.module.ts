import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerRegistrationComponent } from './pages/trainer-registration/trainer-registration.component';
import { ChampionshipConfigurationComponent } from './pages/championship-configuration/championship-configuration.component';
import { ChampionshipSummaryComponent } from './pages/championship-summary/championship-summary.component';
import { AgeSelectorComponent } from './components/age-selector/age-selector.component';
import { ReactiveFormsModule } from '@angular/forms';
import { WeightSelectorComponent } from './components/weight-selector/weight-selector.component';
import { CategoriesSelectorComponent } from './components/categories-selector/categories-selector.component';
import { FormsModule } from '@angular/forms';
import { ParticipantValidationComponent } from './pages/participant-validation/participant-validation.component';
import { GroupingCompetitorsComponent } from './pages/grouping-competitors/grouping-competitors.component';
import { BracketDrawComponent } from './pages/bracket-draw/bracket-draw.component';
import { EightParticipantsBracketComponent } from './components/eight-participants-bracket/eight-participants-bracket.component';
import { TwoParticipantsBracketComponent } from './components/two-participants-bracket/two-participants-bracket.component';
import { FourParticipantsBracketComponent } from './components/four-participants-bracket/four-participants-bracket.component';
import { SixteenParticipantsBracketComponent } from './components/sixteen-participants-bracket/sixteen-participants-bracket.component';
@NgModule({
  declarations: [
    TrainerRegistrationComponent,
    ChampionshipConfigurationComponent,
    ChampionshipSummaryComponent,
    AgeSelectorComponent,
    WeightSelectorComponent,
    CategoriesSelectorComponent,
    ParticipantValidationComponent,
    GroupingCompetitorsComponent,
    BracketDrawComponent,
    TwoParticipantsBracketComponent,
    EightParticipantsBracketComponent,
    FourParticipantsBracketComponent,
    SixteenParticipantsBracketComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class AdminModule {}
