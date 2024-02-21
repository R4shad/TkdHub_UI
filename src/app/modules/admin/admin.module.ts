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
  ],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class AdminModule {}
