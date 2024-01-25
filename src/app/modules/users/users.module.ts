import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizerLoginComponent } from './components/organizer-login/organizer-login.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { ChampionshipViewComponent } from './pages/championship-view/championship-view.component';



@NgModule({
  declarations: [
    OrganizerLoginComponent,
    MainPageComponent,
    ChampionshipViewComponent
  ],
  imports: [
    CommonModule
  ]
})
export class UsersModule { }
