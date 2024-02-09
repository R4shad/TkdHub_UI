import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { agesI } from 'src/app/shared/models/ages';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { divisionI } from 'src/app/shared/models/division';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { ChampionshipI } from 'src/app/shared/models/Championship';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-age-selector',
  templateUrl: './age-selector.component.html',
  styleUrls: ['./age-selector.component.scss'],
})
export class AgeSelectorComponent implements OnInit, OnDestroy {
  championship!: ChampionshipI;
  display = true;

  modalRef?: NgbModalRef;
  subscriptions: Subscription[] = [];
  ages: agesI[] = [];
  ageSelected!: agesI;
  divisions: divisionI[] = [];
  errorMessage: string | null = null;

  constructor(
    private api: ApiService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.showAges();

    this.route.paramMap
      .pipe(
        switchMap((params) => {
          // Obtén el championshipId del parámetro de la ruta
          const championshipId: number = Number(params.get('championshipId'));

          // Utiliza championshipId para hacer la solicitud al servicio
          return this.api.getChampionshipInfo(championshipId);
        })
      )
      .subscribe((data) => {
        this.championship = data;
        console.log(this.championship);
      });
  }

  openModal(content: any) {
    this.divisions = [];
    const subscriptions: Subscription[] = [];
    this.modalRef = this.modalService.open(content);
    for (const age of this.ages) {
      const subscription = this.api.getDivision(age.id).subscribe({
        next: (data) => {
          this.divisions.push(...data);
          console.log('Divisiones obtenidas:', this.divisions);
        },
        error: (error) => {
          console.error('Error al obtener divisiones:', error);
        },
      });
      subscriptions.push(subscription);
    }
  }
  ngOnDestroy() {
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
  defineWeight(age: agesI) {
    this.ageSelected = age;
    this.display = false;
  }
  logAges() {
    //console.log(this.ages);
  }
  confirm() {
    const championshipId = this.championship.championshipId;
    for (const age of this.ages) {
      this.api.postChampionshipAgeInterval(age, championshipId).subscribe({
        next: (response) => {
          console.log('Intervalo de edad agregado:', response);
        },
        error: (error) => {
          console.error('Error al agregar intervalo de edad:', error);
        },
      });
    }
    console.log('Cambios confirmados');
    this.modalRef?.close();
  }
}
