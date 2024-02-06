import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerRegistrationComponent } from './pages/trainer-registration/trainer-registration.component';
import { ChampionshipConfigurationComponent } from './pages/championship-configuration/championship-configuration.component';
import { ChampionshipSummaryComponent } from './pages/championship-summary/championship-summary.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AgeSelectorComponent } from './components/age-selector/age-selector.component';

@NgModule({
  declarations: [
    TrainerRegistrationComponent,
    ChampionshipConfigurationComponent,
    ChampionshipSummaryComponent,
    AgeSelectorComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule],
})
export class AdminModule {}
