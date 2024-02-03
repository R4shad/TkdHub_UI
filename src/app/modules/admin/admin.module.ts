import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerRegistrationComponent } from './pages/trainer-registration/trainer-registration.component';
import { ChampionshipConfigurationComponent } from './pages/championship-configuration/championship-configuration.component';
import { ChampionshipSummaryComponent } from './pages/championship-summary/championship-summary.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TrainerRegistrationComponent,
    ChampionshipConfigurationComponent,
    ChampionshipSummaryComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule],
})
export class AdminModule {}
