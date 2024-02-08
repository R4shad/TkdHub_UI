import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { agesI } from 'src/app/shared/models/ages';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { divisionI } from 'src/app/shared/models/division';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
@Component({
  selector: 'app-age-selector',
  templateUrl: './age-selector.component.html',
  styleUrls: ['./age-selector.component.scss'],
})
export class AgeSelectorComponent implements OnInit, OnDestroy {
  ageSelected!: agesI;
  display = true;
  ages: agesI[] = [];
  modalRef?: NgbModalRef;
  subscriptions: Subscription[] = [];
  agesEditing: agesI = {
    id: 0,
    ageIntervalName: '',
    minAge: 0,
    maxAge: 0,
  };
  divisions: divisionI[] = [];
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
    this.divisions = [];
    const subscriptions: Subscription[] = [];
    this.modalRef = this.modalService.open(content);
    // Itera sobre cada age
    for (const age of this.ages) {
      // Almacena la suscripción

      const subscription = this.api.getDivision(age.id).subscribe({
        next: (data) => {
          // Agrega las divisiones al arreglo divisions
          this.divisions.push(...data);

          console.log('Divisiones obtenidas:', this.divisions);
        },
        error: (error) => {
          // Maneja cualquier error aquí
          console.error('Error al obtener divisiones:', error);
        },
      });
      // Agrega la suscripción al arreglo
      subscriptions.push(subscription);
    }
  }
  ngOnDestroy() {
    // Desuscribe todas las suscripciones para evitar fugas de memoria
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
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
  }

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
