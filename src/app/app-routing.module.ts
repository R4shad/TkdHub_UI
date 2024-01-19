import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainerRegistrationComponent } from './modules/admin/pages/trainer-registration/trainer-registration.component';
import { ChampionshipSummaryComponent } from './modules/admin/pages/championship-summary/championship-summary.component';
import { ChampionshipConfigurationComponent } from './modules/admin/pages/championship-configuration/championship-configuration.component';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
