import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { agesI } from 'src/app/shared/models/ages';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-age-selector',
  templateUrl: './age-selector.component.html',
  styleUrls: ['./age-selector.component.scss'],
})
export class AgeSelectorComponent implements OnInit {
  ages: agesI[] = [];
  modalRef?: NgbModalRef;
  agesEditing: agesI = {
    name: '',
    minAge: 0,
    maxAge: 0,
  };
  errorMessage: string | null = null;
  // Formulario para la edición de la edad
  agesForm: FormGroup;

  constructor(
    private api: ApiService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.agesForm = this.fb.group({
      name: ['', Validators.required],
      minAge: [
        0,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      maxAge: [
        0,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
    });
  }

  ngOnInit(): void {
    this.showAges();
  }

  openModal(content: any, edadAEditar: agesI) {
    this.modalRef = this.modalService.open(content);
    // Establecer valores del formulario al abrir el modal
    this.agesEditing = edadAEditar;
    this.agesForm.patchValue(edadAEditar);
  }

  showAges() {
    this.api.getAges().subscribe((data) => {
      this.ages = data;
    });
  }

  deleteAge(ageRemoved: agesI) {
    this.ages = this.ages.filter((edad) => edad !== ageRemoved);
  }

  save() {
    this.errorMessage = null; // Reinicia el mensaje de error
    if (this.agesForm.valid) {
      const modifiedIndex = this.ages.findIndex(
        (age) => age.name === this.agesEditing.name
      );

      if (modifiedIndex !== -1) {
        const actualRange = {
          min: this.agesForm.value.edadMinima,
          max: this.agesForm.value.edadMaxima,
        };
        if (this.validateOverlap(actualRange)) {
          this.errorMessage = 'Error: Las edades se sobreponen.';
          return; // Evita que se guarde la edad si hay superposición
        } else {
          this.ages[modifiedIndex] = this.agesForm.value;
        }
      }

      this.modalRef?.close();
    }
  }

  validateOverlap(currentRange: { min: number; max: number }): boolean {
    return this.ages.some((age) => {
      if (age.name !== this.agesEditing.name) {
        const ageRange = { min: age.minAge, max: age.maxAge };
        if (currentRange.min + currentRange.max > ageRange.min + ageRange.max) {
          return currentRange.min <= ageRange.max;
        } else {
          return currentRange.max >= ageRange.min;
        }
      }
      return false;
    });
  }
}
