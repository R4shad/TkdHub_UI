import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainerRegistrationComponent } from './modules/admin/pages/trainer-registration/trainer-registration.component';
import { ChampionshipSummaryComponent } from './modules/admin/pages/championship-summary/championship-summary.component';
import { ChampionshipConfigurationComponent } from './modules/admin/pages/championship-configuration/championship-configuration.component';

import { CompetitorViewComponent } from './modules/trainers/pages/competitor-view/competitor-view.component';
import { CompetitorRegistrationComponent } from './modules/trainers/pages/competitor-registration/competitor-registration.component';

import { MainPageComponent } from './modules/users/pages/main-page/main-page.component';

const routes: Routes = [
  {
    path: 'Registro-Clubes',
    component: TrainerRegistrationComponent,
  },
  {
    path: 'Vista-Clubes',
    component: ChampionshipSummaryComponent,
  },
  {
    path: 'Configuracion-Campeonato',
    component: ChampionshipConfigurationComponent,
  },

  {
    path: 'Vista-Competidores',
    component: CompetitorViewComponent,
  },
  {
    path: 'Registro-Competidores',
    component: CompetitorRegistrationComponent,
  },
  {
    path: '',
    component: MainPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
