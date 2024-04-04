import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompetitorViewComponent } from './pages/competitor-view/competitor-view.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [CompetitorViewComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class TrainersModule {}
