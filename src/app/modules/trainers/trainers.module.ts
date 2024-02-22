import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompetitorRegistrationComponent } from './pages/competitor-registration/competitor-registration.component';
import { CompetitorViewComponent } from './pages/competitor-view/competitor-view.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [CompetitorRegistrationComponent, CompetitorViewComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class TrainersModule {}
