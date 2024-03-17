import { ageToEditI, agesI, responseAgeI } from 'src/app/shared/models/ages';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import {
  categoryI,
  categoryToEditI,
  responseCategoryI,
} from '../../../../shared/models/category';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ChampionshipI } from 'src/app/shared/models/Championship';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { obtenerValorNumerico } from '../../utils/participantValidation.utils';

interface agesEI extends agesI {
  isEdit: boolean;
}
interface categoryEI extends categoryI {
  isEdit: boolean;
}

@Component({
  selector: 'app-configure-div-cat',
  templateUrl: './configure-div-cat.component.html',
  styleUrls: ['./configure-div-cat.component.scss'],
})
export class ConfigureDivCatComponent implements OnInit {
  ages: agesEI[] = [];
  modalRef?: NgbModalRef | undefined;
  displayWeights = true;
  ageSelected!: agesI;
  championship!: ChampionshipI;
  constructor(
    private api: ApiService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initAges();
    this.initCategory();
  }

  initAges() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const championshipId: number = Number(params.get('championshipId'));
          this.championshipId = championshipId;
          this.api
            .getChampionshipInfo(this.championshipId)
            .subscribe((data) => {
              this.championship = data;
            });
          return this.api.getChampionshipAges(championshipId);
        })
      )
      .subscribe((data) => {
        this.ages = data.map((age) => ({ ...age, isEdit: false }));
        this.ages = this.ages.slice().sort((a, b) => a.minAge - b.minAge);
      });
  }
  openModal(content: any) {
    this.modalRef = this.modalService.open(content);
  }

  deleteAge(ageRemoved: agesEI) {
    this.api
      .deleteAgeInterval(ageRemoved.ageIntervalId)
      .subscribe((data) => {});

    this.ages = this.ages.filter((age) => age !== ageRemoved);
  }
  seeWeights(age: agesEI) {
    this.ageSelected = age;
    this.displayWeights = false;
  }
  onEditAge(age: agesEI) {
    this.ages.forEach((age) => {
      age.isEdit = false;
    });
    age.isEdit = true;
  }

  cancelEditAge(age: agesEI) {
    age.isEdit = false;
  }
  confirmEditAge(age: agesEI) {
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

  championshipId: number = 0;
  categories: categoryEI[] = [];
  categoryRegistered: boolean = false;
  initCategory() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const championshipId: number = Number(params.get('championshipId'));
          return this.api.getChampionshipCategory(championshipId);
        })
      )
      .subscribe((data) => {
        // Mapea las categorías y agrega el valor numérico de minGrade
        const mappedCategories = data.map((category) => ({
          ...category,
          isEdit: false, // Aumenta el campo isEdit
          numericMinGrade: obtenerValorNumerico(category.gradeMin),
        }));

        // Ordena las categorías por el valor numérico de minGrade de menor a mayor
        this.categories = mappedCategories.sort(
          (a, b) => a.numericMinGrade - b.numericMinGrade
        );
      });
  }
  deleteCategory(categoryRemoved: categoryEI) {
    this.api.deleteCategory(categoryRemoved.categoryId).subscribe((data) => {});

    this.categories = this.categories.filter(
      (category) => category !== categoryRemoved
    );
  }
  onEditCategory(category: categoryEI) {
    this.categories.forEach((category) => {
      category.isEdit = false;
    });
    category.isEdit = true;
  }
  cancelEditCategory(category: categoryEI) {
    category.isEdit = false;
  }
  confirmEditCategory(category: categoryEI) {
    console.log(category);
    const newCategory: categoryToEditI = {
      categoryName: category.categoryName,
      gradeMin: category.gradeMin,
      gradeMax: category.gradeMax,
      numberOfCompetitors: category.numberOfCompetitors,
    };
    console.log(newCategory);
    this.api
      .editCategory(category.championshipId, category.categoryId, newCategory)
      .subscribe((response: responseCategoryI) => {
        console.log(response.data);
        if (response.status == 200) {
          alert('Editado correctamente');
          category.isEdit = false;
        }
      });
  }

  confirm() {
    if (this.modalRef) {
      // Verifica si modalRef está definido
      this.api
        .updateChampionshipStage(this.championshipId)
        .subscribe((data) => {
          if (data === 200) {
            if (this.modalRef != undefined) {
              this.modalRef.close(); // Cierra modalRef solo si está definido
            }
            this.router.navigate([
              '/championship',
              this.championshipId,
              'Organizer',
            ]);
          }
        });
    } else {
      console.warn('modalRef no está definido'); // Muestra una advertencia si modalRef no está definido
    }
  }
}
