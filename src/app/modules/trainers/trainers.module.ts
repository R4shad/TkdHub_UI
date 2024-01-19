import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompetitorRegistrationComponent } from './pages/competitor-registration/competitor-registration.component';
import { CompetitorViewComponent } from './pages/competitor-view/competitor-view.component';



@NgModule({
  declarations: [
    CompetitorRegistrationComponent,
    CompetitorViewComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TrainersModule { }
