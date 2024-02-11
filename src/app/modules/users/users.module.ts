import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizerLoginComponent } from './components/organizer-login/organizer-login.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { ChampionshipViewComponent } from './pages/championship-view/championship-view.component';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { TrainerLoginComponent } from './components/trainer-login/trainer-login.component';
import { ResponsibleLoginComponent } from './components/responsible-login/responsible-login.component';
@NgModule({
  declarations: [
    OrganizerLoginComponent,
    MainPageComponent,
    ChampionshipViewComponent,
    LoginComponent,
    TrainerLoginComponent,
    ResponsibleLoginComponent,
  ],
  imports: [CommonModule, FormsModule],
  providers: [AuthService],
})
export class UsersModule {}
