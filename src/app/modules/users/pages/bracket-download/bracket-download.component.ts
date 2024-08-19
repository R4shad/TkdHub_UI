import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { DatePipe } from '@angular/common';
import { jsPDF } from 'jspdf';
import {
  bracketI,
  bracketWithCompetitorsI,
  bracketWithMatchesI,
} from 'src/app/shared/models/bracket';
import { divisionI } from 'src/app/shared/models/division';
import { categoryI } from 'src/app/shared/models/category';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { agesI } from 'src/app/shared/models/ages';
import { ChampionshipI } from 'src/app/shared/models/Championship';
import html2canvas from 'html2canvas';
import { DownloadService } from '../../utils/download.service';

@Component({
  selector: 'app-bracket-download',
  templateUrl: './bracket-download.component.html',
  styleUrls: ['./bracket-download.component.scss'],
})
export class BracketDownloadComponent implements OnInit {
  championshipId: number = 0;

  brackets: bracketWithCompetitorsI[] = [];

  divisions: divisionI[] = [];
  categories: categoryI[] = [];

  modalRef?: NgbModalRef | undefined;
  ageIntervals: agesI[] = [];
  championship!: ChampionshipI;
  downloading = false;
  progress = 0;
  total = 0;
  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private downloadService: DownloadService
  ) {}

  ngOnInit(): void {
    this.downloadService.startDownload();
    this.route.paramMap.subscribe((params) => {
      this.championshipId = Number(params.get('championshipId'));
    });
    this.getData();
  }

  openModal(content: any) {
    this.modalRef = this.modalService.open(content);
  }
  formatFecha(fecha: string): string {
    const meses = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];

    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate();
    const mes = meses[fechaObj.getMonth()];
    const año = fechaObj.getFullYear();

    return `${dia} de ${mes} del ${año}`;
  }
  getData() {
    this.route.paramMap.subscribe((params) => {
      this.championshipId = Number(params.get('championshipId'));
      this.api.getChampionshipInfo(this.championshipId).subscribe((data) => {
        this.championship = data;
      });
    });

    this.api
      .getBracketsWithCompetitors(this.championshipId)
      .subscribe((data) => {
        this.brackets = data;

        setTimeout(() => {
          this.generatePDF();
        }, 2000);
      });

    this.api
      .getCategoriesWithCompetitors(this.championshipId)
      .subscribe((data) => {
        this.categories = data;
      });
    this.api
      .getDivisionsWithCompetitors(this.championshipId)
      .subscribe((data) => {
        this.divisions = data;
        for (const division of this.divisions) {
          this.api.getDivisionData(division.divisionId).subscribe((data) => {
            division.ageIntervalId = data.ageIntervalId;
            division.gender = data.gender;
            division.grouping = data.grouping;
            division.minWeight = data.minWeight;
            division.maxWeight = data.maxWeight;
          });
        }
        this.api
          .getChampionshipAgeInterval(this.championshipId)
          .subscribe((data) => {
            this.ageIntervals = data;
            this.ageIntervals.sort((a, b) => a.minAge - b.minAge);

            this.ageIntervals = this.ageIntervals.filter((interval) =>
              this.divisions.some(
                (division) => division.ageIntervalId === interval.ageIntervalId
              )
            );
          });
      });
  }

  getBracketGrouping(bracket: bracketI) {
    const matchingDivision = this.divisions.find(
      (div) => div.divisionId === bracket.divisionId
    );
    if (matchingDivision) {
      return matchingDivision.grouping;
    }
    return null;
  }
  getBracketMinWeightInterval(bracket: bracketI) {
    const matchingDivision = this.divisions.find(
      (div) => div.divisionId === bracket.divisionId
    );
    if (matchingDivision) {
      return matchingDivision.minWeight;
    }
    return null;
  }
  getBracketMaxWeightInterval(bracket: bracketI) {
    const matchingDivision = this.divisions.find(
      (div) => div.divisionId === bracket.divisionId
    );
    if (matchingDivision) {
      return matchingDivision.maxWeight;
    }
    return null;
  }

  getBracketCategoryName(bracket: bracketI) {
    const category = this.categories.find(
      (cat) => cat.categoryId === bracket.categoryId
    );
    if (category) {
      return category.categoryName;
    }
    return null;
  }

  returnToSummary() {
    this.router.navigate(['/Championship', this.championshipId, 'Organizer']);
  }

  getBracketDivision(bracket: bracketI) {
    const matchingDivision = this.divisions.find(
      (div) => div.divisionId === bracket.divisionId
    );
    if (matchingDivision) {
      return matchingDivision;
    }
    return null;
  }

  getBracketCategory(bracket: bracketI) {
    const matchingCategory = this.categories.find(
      (cat) => cat.categoryId === bracket.categoryId
    );
    if (matchingCategory) {
      return matchingCategory;
    }
    return null;
  }

  async generatePDF(): Promise<void> {
    this.downloading = true;
    console.log('ENTRE');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 265;
    const imgHeight = 120; // Altura de la imagen del bracket
    const topMargin = 0; // Margen superior

    // Conteo total de brackets a descargar
    const totalBrackets = this.brackets.length;
    this.total = totalBrackets;
    // Renderizar el contenido del div en un canvas
    const descriptionData: any = document.getElementById('pdfDescription');
    if (descriptionData) {
      const descriptionCanvas = await html2canvas(descriptionData);
      const descriptionImgData = descriptionCanvas.toDataURL('image/png');

      let y = topMargin + 5; // Posición Y de la imagen del bracket inicial

      for (let index = 0; index < totalBrackets; index++) {
        // Calcular el progreso actual
        this.progress = index + 1;

        if (index === 0) {
          pdf.addImage(descriptionImgData, 'PNG', -30, 5, imgWidth, 10);
          y = topMargin + 15;
        }
        if (index > 0 && index % 2 === 0) {
          pdf.addPage();
          y = topMargin + 15;
          pdf.addImage(descriptionImgData, 'PNG', -30, 5, imgWidth, 10);
        }

        const bracketData: any = document.getElementById(`bracket${index}`);
        if (bracketData) {
          const bracketCanvas = await html2canvas(bracketData);
          const bracketImgData = bracketCanvas.toDataURL('image/png');
          pdf.addImage(bracketImgData, 'PNG', -25, y, imgWidth, imgHeight);
          y += imgHeight + 10; // Actualizar la posición Y para el próximo bracket

          // Si es el último bracket, guardar el PDF
          if (index === totalBrackets - 1) {
            pdf.save(`championship.pdf`);
            window.close();
          }
        }
      }
    } else {
      console.error('Elemento pdfDescription no encontrado.');
      this.downloading = false;
    }
  }
}
