import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizerLoginComponent } from './components/organizer-login/organizer-login.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { ChampionshipViewComponent } from './pages/championship-view/championship-view.component';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
@NgModule({
  declarations: [
    OrganizerLoginComponent,
    MainPageComponent,
    ChampionshipViewComponent,
    LoginComponent,
  ],
  imports: [CommonModule, FormsModule],
  providers: [AuthService],
})
export class UsersModule {}
