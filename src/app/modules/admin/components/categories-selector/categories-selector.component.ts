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

interface categoryEI extends categoryI {
  isEdit: boolean;
}

@Component({
  selector: 'app-categories-selector',
  templateUrl: './categories-selector.component.html',
  styleUrls: ['./categories-selector.component.scss'],
})
export class CategoriesSelectorComponent implements OnInit {
  championship!: ChampionshipI;
  categories: categoryEI[] = [];
  modalRef?: NgbModalRef;
  categoryRegistered: boolean = false;
  constructor(
    private api: ApiService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const championshipId: number = Number(params.get('championshipId'));
          return this.api.getChampionshipCategory(championshipId);
        })
      )
      .subscribe((data) => {
        this.categories = data.map((category) => ({
          ...category,
          isEdit: false,
        }));
      });
  }

  openModal(content: any) {
    this.modalRef = this.modalService.open(content);
  }

  deleteCategory(categoryRemoved: categoryEI) {
    this.api.deleteCategory(categoryRemoved.categoryId).subscribe((data) => {});

    this.categories = this.categories.filter(
      (category) => category !== categoryRemoved
    );
  }

  imprimirCategorias(content: any) {
    this.modalRef = this.modalService.open(content);
  }

  confirm() {
    const championshipId = this.championship.championshipId;
    for (const category of this.categories) {
      this.api.postChampionshipCategory(category, championshipId).subscribe({
        next: (response) => {
          console.log('Categoria agregado:', response);
        },
        error: (error) => {
          console.error('Error al agregar la Categoria:', error);
        },
      });
    }
    console.log('Cambios confirmados');
    this.categoryRegistered = true;
    this.modalRef?.close();
  }

  onEdit(category: categoryEI) {
    this.categories.forEach((category) => {
      category.isEdit = false;
    });
    category.isEdit = true;
  }

  cancelEdit(category: categoryEI) {
    category.isEdit = false;
  }

  confirmEdit(category: categoryEI) {
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
}
