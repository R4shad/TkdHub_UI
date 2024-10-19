import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainerRegistrationComponent } from './modules/admin/pages/trainer-registration/trainer-registration.component';

import { ChampionshipConfigurationComponent } from './modules/admin/pages/championship-configuration/championship-configuration.component';
import { GroupingCompetitorsComponent } from './modules/admin/pages/grouping-competitors/grouping-competitors.component';
import { BracketDrawComponent } from './modules/admin/pages/bracket-draw/bracket-draw.component';
import { CompetitorViewComponent } from './modules/trainers/pages/competitor-view/competitor-view.component';

import { MainPageComponent } from './modules/users/pages/main-page/main-page.component';
import { ChampionshipViewComponent } from './modules/users/pages/championship-view/championship-view.component';
import { LoginComponent } from './modules/users/pages/login/login.component';

import { ChampionshipSummaryComponent } from './modules/admin/pages/championship-summary/championship-summary.component';
import { ParticipantValidationComponent } from './modules/admin/pages/participant-validation/participant-validation.component';
import { ChampionshipCreatorComponent } from './modules/admin/pages/championship-creator/championship-creator.component';
import { BracketResultsComponent } from './modules/responsibles/pages/bracket-results/bracket-results.component';
import { BracketViwerComponent } from './modules/users/pages/bracket-viwer/bracket-viwer.component';
import { BracketDownloadComponent } from './modules/users/pages/bracket-download/bracket-download.component';
import { ResponsibleRegistrationComponent } from './modules/admin/pages/responsible-registration/responsible-registration.component';
import { CreateUserPasswordComponent } from './modules/users/pages/create-user-password/create-user-password.component';

import { AuthGuard } from './auth.guard';
import { SummaryComponent } from './modules/users/pages/summary/summary.component';
import { ForgotPasswordComponent } from './modules/users/pages/forgot-password/forgot-password.component';

const routes: Routes = [
  {
    path: 'Administrator/CrearCampeonato',
    component: ChampionshipCreatorComponent,
  },
  {
    path: '',
    component: MainPageComponent,
  },
  {
    path: 'Championship/:championshipId',
    component: ChampionshipViewComponent, // Componente para los detalles del campeonato
  },
  {
    path: 'Championship/:championshipId/login',
    component: LoginComponent, // Componente para los detalles del campeonato
  },
  {
    path: 'Championship/:championshipId/Organizer',
    component: ChampionshipSummaryComponent, // Componente para los detalles del campeonato
    canActivate: [AuthGuard], // Aplica la protección de autenticación
    data: { expectedRoles: ['Organizer'] }, // Especifica los roles permitidos para esta ruta
  },
  {
    path: 'Championship/:championshipId/Organizer/TraineeRegistration',
    component: TrainerRegistrationComponent, // Componente para los detalles del campeonato
    canActivate: [AuthGuard], // Aplica la protección de autenticación
    data: { expectedRoles: ['Organizer'] }, // Especifica los roles permitidos para esta ruta
  },
  {
    path: 'Championship/:championshipId/Organizer/ResponsibleRegistration',
    component: ResponsibleRegistrationComponent, // Componente para los detalles del campeonato
    canActivate: [AuthGuard], // Aplica la protección de autenticación
    data: { expectedRoles: ['Organizer'] }, // Especifica los roles permitidos para esta ruta
  },
  {
    path: 'Championship/:championshipId/Organizer/ParticipantValidation',
    component: ParticipantValidationComponent, // Componente para los detalles del campeonato
    canActivate: [AuthGuard], // Aplica la protección de autenticación
    data: { expectedRoles: ['Organizer'] }, // Especifica los roles permitidos para esta ruta
  },
  {
    path: 'Championship/:championshipId/Organizer/ChampionshipConfiguration',
    component: ChampionshipConfigurationComponent,
    canActivate: [AuthGuard], // Aplica la protección de autenticación
    data: { expectedRoles: ['Organizer'] }, // Especifica los roles permitidos para esta ruta
  },
  {
    path: 'Championship/:championshipId/Organizer/Grouping',
    component: GroupingCompetitorsComponent,
    canActivate: [AuthGuard], // Aplica la protección de autenticación
    data: { expectedRoles: ['Organizer'] }, // Especifica los roles permitidos para esta ruta
  },
  {
    path: 'Championship/:championshipId/Organizer/BracketDraw',
    component: BracketDrawComponent,
    canActivate: [AuthGuard], // Aplica la protección de autenticación
    data: { expectedRoles: ['Organizer'] }, // Especifica los roles permitidos para esta ruta
  },
  {
    path: 'Championship/:championshipId/Organizer/BracketDraw/DownloadBracket',
    component: BracketDownloadComponent,
    canActivate: [AuthGuard], // Aplica la protección de autenticación
    data: { expectedRoles: ['Organizer'] }, // Especifica los roles permitidos para esta ruta
  },
  {
    path: 'Championship/:championshipId/Coach/:clubCode',
    component: CompetitorViewComponent,
    canActivate: [AuthGuard], // Aplica la protección de autenticación
    data: { expectedRoles: ['Coach'] }, // Especifica los roles permitidos para esta ruta
  },
  {
    path: 'Championship/:championshipId/Summary',
    component: SummaryComponent,
  },
  {
    path: 'Championship/:championshipId/Scorer/BracketResults',
    component: BracketResultsComponent,
  },

  {
    path: 'Championship/:championshipId/BracketViwer',
    component: BracketViwerComponent,
  },
  {
    path: 'Championship/:championshipId/forgotPassword',
    component: ForgotPasswordComponent,
  },

  {
    path: 'Championship/:championshipId/CreatePassword/:user/:email',
    component: CreateUserPasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
