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
  isDefined: boolean = false;
  selectedImage: number = 0;
  constructor(
    private api: ApiService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log(this.ageInterval.minAge);
    if (this.ageInterval.minAge < 18) {
      this.isDefined = true;
    } else {
    }
    this.getData();
    console.log(this.isDefined);
  }
  selectImage(imageNumber: number) {
    this.selectedImage = imageNumber;
  }

  confirm() {
    console.log(this.selectedImage);
    //pesos Mundiales
    if (this.selectedImage === 1) {
      this.api
        .deleteMayorWeight(this.ageInterval.championshipId, 'Mayores Olimpicos')
        .subscribe((data) => {
          if (data.status === 200) {
            if (this.modalRef != undefined) {
              this.modalRef.close();
              this.router.navigate([
                '/championship',
                this.ageInterval.championshipId,
                'Organizer',
              ]);
            }
          }
        });
    } else {
      if (this.selectedImage === 2) {
        //pesos olimpicos
        this.api
          .deleteMayorWeight(
            this.ageInterval.championshipId,
            'Mayores Mundiales'
          )
          .subscribe((data) => {
            if (data.status === 200) {
              if (this.modalRef != undefined) {
                this.modalRef.close();
                this.router.navigate([
                  '/championship',
                  this.ageInterval.championshipId,
                  'Organizer',
                ]);
              }
            }
          });
      } else {
        //No selecciono nada
      }
    }
  }

  verifyWeightDefined() {
    const uniqueGroupings = new Set<string>();
    this.divisions.forEach((division) => {
      uniqueGroupings.add(division.grouping);
    });
    console.log('TAMANIO', uniqueGroupings.size);
    return uniqueGroupings.size === 1;
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

        if (this.verifyWeightDefined()) {
          this.isDefined = true;
        }
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
