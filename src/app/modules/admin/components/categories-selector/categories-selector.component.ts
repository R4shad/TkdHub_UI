import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { categoryI } from '../../../../shared/models/category';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ChampionshipI } from 'src/app/shared/models/Championship';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-categories-selector',
  templateUrl: './categories-selector.component.html',
  styleUrls: ['./categories-selector.component.scss'],
})
export class CategoriesSelectorComponent implements OnInit {
  championship!: ChampionshipI;
  categories: categoryI[] = [];
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
          return this.api.getChampionshipInfo(championshipId);
        })
      )
      .subscribe((data) => {
        this.championship = data;
        this.api
          .getChampionshipCategory(this.championship.championshipId)
          .subscribe((data) => {
            if (data.length > 0) {
              this.categoryRegistered = true;
            }
          });
      });

    this.mostrarCategorias();
  }

  openModal(content: any) {
    this.modalRef = this.modalService.open(content);
  }

  mostrarCategorias() {
    this.api.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  eliminarCategoria(categoriaEliminar: categoryI) {
    this.categories = this.categories.filter(
      (categoria) => categoria !== categoriaEliminar
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
}
