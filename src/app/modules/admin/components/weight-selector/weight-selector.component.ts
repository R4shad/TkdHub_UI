import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { divisionI } from 'src/app/shared/models/division';
import { agesI } from 'src/app/shared/models/ages';

@Component({
  selector: 'app-weight-selector',
  templateUrl: './weight-selector.component.html',
  styleUrls: ['./weight-selector.component.scss'],
})
export class WeightSelectorComponent implements OnInit {
  @Input() ageInterval!: agesI;
  @Output() returnToAgeSelector = new EventEmitter<void>();
  divisions: divisionI[] = [];
  divisionsF: divisionI[] = [];
  divisionsM: divisionI[] = [];
  hasBothGenders: boolean = false;
  rowComplete: boolean = false;
  dataLoaded: boolean = false;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.getDivision();
  }

  returnAgeIntervalSelector() {
    this.returnToAgeSelector.emit();
  }

  getDivision() {
    this.api.getDivision(this.ageInterval.id).subscribe((data) => {
      this.divisions = data;
      // Verificar si hay divisiones con género "Ambos"
      this.hasBothGenders = this.divisions.some(
        (division) => division.gender === 'Ambos'
      );

      if (!this.hasBothGenders) {
        // Filtrar las divisiones según el género
        this.divisionsF = this.divisions.filter(
          (division) => division.gender === 'Femenino'
        );

        this.divisionsM = this.divisions.filter(
          (division) => division.gender === 'Masculino'
        );
      }

      // Una vez que los datos están listos, establecer dataLoaded en true
      this.dataLoaded = true;
    });
  }
}
