import { Component, OnInit, EventEmitter, Output } from '@angular/core';
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
    id: 0,
    ageIntervalName: '',
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

  openModal(content: any) {
    this.modalRef = this.modalService.open(content);
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
        (age) => age.ageIntervalName === this.agesEditing.ageIntervalName
      );

      if (modifiedIndex !== -1) {
        const actualRange = {
          min: this.agesForm.value.edadMinima,
          max: this.agesForm.value.edadMaxima,
        };
      }

      this.modalRef?.close();
    }
  }

  ageSelected!: agesI;
  display = true;
  defineWeight(age: agesI) {
    this.ageSelected = age;
    this.display = false;
  }

  logAges() {
    console.log(this.ages);
  }

  cancel() {}

  confirm() {
    // Aquí puedes realizar alguna acción, como guardar los cambios
    console.log('Cambios confirmados');
    // Luego cierra el modal
    this.cancel();
  }
}
