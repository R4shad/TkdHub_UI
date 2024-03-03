import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { agesI } from 'src/app/shared/models/ages';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-age-selector',
  templateUrl: './age-selector.component.html',
  styleUrls: ['./age-selector.component.scss'],
})
export class AgeSelectorComponent implements OnInit, OnDestroy {
  ages: agesI[] = [];
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
          return this.api.getAges();
        })
      )
      .subscribe((data) => {
        this.ages = data;
        console.log(this.ages);
      });
  }

  ngOnDestroy() {
    // Cualquier limpieza necesaria aquí
  }

  openModal(content: any) {
    this.modalRef = this.modalService.open(content);
  }

  deleteAge(ageRemoved: agesI) {
    // Lógica para eliminar la edad seleccionada
  }

  defineWeight(age: agesI) {
    // Lógica para definir el peso
  }

  confirm() {
    // Lógica para confirmar los cambios
  }
  editAge(age: any) {}
}
