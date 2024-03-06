import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { agesI } from 'src/app/shared/models/ages';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
interface agesEI extends agesI {
  isEdit: boolean;
}

@Component({
  selector: 'app-age-selector',
  templateUrl: './age-selector.component.html',
  styleUrls: ['./age-selector.component.scss'],
})
export class AgeSelectorComponent implements OnInit, OnDestroy {
  ages: agesEI[] = [];
  modalRef?: NgbModalRef;

  constructor(
    private api: ApiService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const championshipId: number = Number(params.get('championshipId'));
          return this.api.getChampionshipAges(championshipId);
        })
      )
      .subscribe((data) => {
        this.ages = data.map((age) => ({ ...age, isEdit: false }));
      });
  }

  ngOnDestroy() {
    // Cualquier limpieza necesaria aquí
  }

  openModal(content: any) {
    this.modalRef = this.modalService.open(content);
  }

  deleteAge(ageRemoved: agesEI) {
    this.ages = this.ages.filter((age) => age !== ageRemoved);
  }

  defineWeight(age: agesEI) {
    // Lógica para definir el peso
  }

  confirm() {
    // Lógica para confirmar los cambios
  }

  onEdit(age: agesEI) {
    this.ages.forEach((age) => {
      age.isEdit = false;
    });
    age.isEdit = true;
  }

  cancelEdit(age: agesEI) {
    age.isEdit = false;
  }

  confirmEdit(age: agesEI) {
    // Lógica para confirmar la edición de la edad
  }
}
