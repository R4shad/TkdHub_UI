import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import {
  divisionI,
  divisionToEditI,
  responseDivisionI,
} from 'src/app/shared/models/division';
import { agesI } from 'src/app/shared/models/ages';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
interface divisionEI extends divisionI {
  isEdit: boolean;
}

@Component({
  selector: 'app-weight-selector',
  templateUrl: './weight-selector.component.html',
  styleUrls: ['./weight-selector.component.scss'],
})
export class WeightSelectorComponent implements OnInit {
  @Input() ageInterval!: agesI;
  @Output() returnToAgeSelector = new EventEmitter<void>();
  divisions: divisionEI[] = [];
  divisionsF: divisionEI[] = [];
  divisionsM: divisionEI[] = [];
  dataLoaded: boolean = false;
  modalRef?: NgbModalRef;
  constructor(
    private api: ApiService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    console.log(this.ageInterval);
    this.api
      .getDivisionsByAge(this.ageInterval.ageIntervalId)
      .subscribe((data) => {
        this.divisions = data.map((division) => ({
          ...division,
          isEdit: false,
        }));
        this.divisionsM = this.divisions.filter(
          (division) => division.gender === 'Masculino'
        );
        this.divisionsF = this.divisions.filter(
          (division) => division.gender === 'Femenino'
        );
        console.log(this.divisions);
        console.log(this.divisionsM);
      });
  }

  openModal(content: any) {
    this.modalRef = this.modalService.open(content);
  }

  deleteDivision(divisionRemoved: divisionI, gender: string) {
    this.api.deleteDivision(divisionRemoved.divisionId).subscribe((data) => {});

    if (gender === 'Masculino') {
      this.divisionsM = this.divisionsM.filter(
        (division) => division !== divisionRemoved
      );
    } else {
      this.divisionsF = this.divisionsF.filter(
        (division) => division !== divisionRemoved
      );
    }
  }

  onEdit(division: divisionEI, gender: string) {
    if (gender === 'Masculino') {
      this.divisionsM.forEach((age) => {
        division.isEdit = false;
      });
    } else {
      this.divisionsF.forEach((age) => {
        division.isEdit = false;
      });
    }
    division.isEdit = true;
  }

  cancelEdit(division: divisionEI) {
    division.isEdit = false;
  }

  confirmEdit(division: divisionEI) {
    console.log(division);
    const newDivision: divisionToEditI = {
      divisionName: division.divisionName,
      ageIntervalId: division.ageIntervalId,
      minWeight: division.minWeight,
      maxWeight: division.maxWeight,
      gender: division.gender,
      grouping: division.grouping,
      numberOfCompetitors: division.numberOfCompetitors,
    };
    console.log(newDivision);
    this.api
      .editDivision(division.championshipId, division.divisionId, newDivision)
      .subscribe((response: responseDivisionI) => {
        console.log(response.data);
        if (response.status == 200) {
          alert('Editado correctamente');
          division.isEdit = false;
        }
      });
  }

  returnAgeIntervalSelector() {
    this.returnToAgeSelector.emit();
  }
}
