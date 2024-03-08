import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { ageToEditI, agesI, responseAgeI } from 'src/app/shared/models/ages';
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
export class AgeSelectorComponent implements OnInit {
  ages: agesEI[] = [];
  modalRef?: NgbModalRef;
  display = true;
  ageSelected!: agesI;
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

  openModal(content: any) {
    this.modalRef = this.modalService.open(content);
  }

  deleteAge(ageRemoved: agesEI) {
    this.ages = this.ages.filter((age) => age !== ageRemoved);
  }

  seeWeights(age: agesEI) {
    this.ageSelected = age;
    this.display = false;
  }

  confirm() {}

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
    console.log(age);
    const newAge: ageToEditI = {
      ageIntervalName: age.ageIntervalName,
      minAge: age.minAge,
      maxAge: age.maxAge,
    };
    console.log(newAge);
    this.api
      .editAge(age.championshipId, age.ageIntervalId, newAge)
      .subscribe((response: responseAgeI) => {
        console.log(response.data);
        if (response.status == 200) {
          alert('Editado correctamente');
          age.isEdit = false;
        }
      });
  }
}
