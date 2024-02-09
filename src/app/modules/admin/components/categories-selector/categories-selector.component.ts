import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { categoryI } from '../../../../shared/models/category';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-categories-selector',
  templateUrl: './categories-selector.component.html',
  styleUrls: ['./categories-selector.component.scss'],
})
export class CategoriesSelectorComponent implements OnInit {
  categorias: categoryI[] = [];
  modalRef?: NgbModalRef;
  categoriaEditando: categoryI = {
    categoryName: '',
    gradeMin: '',
    gradeMax: '',
  };
  errorMensaje: string | null = null;
  // Formulario para la edición de la categoría
  categoriaForm: FormGroup;

  constructor(
    private api: ApiService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.categoriaForm = this.fb.group({
      nombreCategoria: ['', Validators.required],
      gradoMinimo: ['', Validators.required],
      gradoMaximo: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.mostrarCategorias();
  }

  openModal(content: any, categoriaEditar: categoryI) {
    this.modalRef = this.modalService.open(content);
    this.categoriaEditando = categoriaEditar;
    this.categoriaForm.patchValue(categoriaEditar);
  }

  mostrarCategorias() {
    //this.api.getCategorias().subscribe((data) => {
    //  this.categorias = data;
    //});
  }

  eliminarCategoria(categoriaEliminar: categoryI) {
    this.categorias = this.categorias.filter(
      (categoria) => categoria !== categoriaEliminar
    );
  }

  guardarCategoria() {
    this.errorMensaje = null; // Reinicia el mensaje de error
    if (this.categoriaForm.valid) {
      const indiceCategoriaModificada = this.categorias.findIndex(
        (categoria) =>
          categoria.categoryName === this.categoriaEditando.categoryName
      );

      if (indiceCategoriaModificada !== -1) {
        const rangoActual = {
          min: this.obtenerValorNumerico(this.categoriaForm.value.gradoMinimo),
          max: this.obtenerValorNumerico(this.categoriaForm.value.gradoMaximo),
        };

        if (this.validarSuperposicionCategoria(rangoActual)) {
          this.errorMensaje = 'Error: Las categorías se sobreponen.';
          return; // Evita que se guarde la categoría si hay superposición
        } else {
          this.categorias[indiceCategoriaModificada] = this.categoriaForm.value;
        }
      }

      this.modalRef?.close();
    }
  }

  validarSuperposicionCategoria(rangoExistente: {
    min: number;
    max: number;
  }): boolean {
    return this.categorias.some((categoria) => {
      if (categoria.categoryName !== this.categoriaEditando.categoryName) {
        const rangoActual = {
          min: this.obtenerValorNumerico(categoria.gradeMin),
          max: this.obtenerValorNumerico(categoria.gradeMax),
        };
        if (
          rangoExistente.min + rangoExistente.max >
          rangoActual.min + rangoActual.max
        ) {
          return rangoExistente.min <= rangoActual.max;
        } else {
          return rangoExistente.max >= rangoActual.min;
        }
      }
      return false;
    });
  }
  obtenerValorNumerico(grado: string): number {
    switch (grado.toLowerCase()) {
      case 'franja amarillo':
        return 1;
      case 'amarillo':
        return 2;
      case 'franja verde':
        return 3;
      case 'verde':
        return 4;
      case 'franja azul':
        return 5;
      case 'azul':
        return 6;
      case 'franja rojo':
        return 7;
      case 'rojo':
        return 8;
      case 'franja negro':
        return 9;
      case 'negro':
        return 10;
      default:
        return 0; // Valor por defecto o para casos no manejados
    }
  }
}
