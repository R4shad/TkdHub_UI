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

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.championshipId = Number(params.get('championshipId'));
    });

    this.getData();
  }

  openModal(content: any) {
    this.modalRef = this.modalService.open(content);
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
        }, 1000);
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
    this.router.navigate(['/championship', this.championshipId, 'Organizer']);
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
  /*generatePDF(): void {
    console.log('ENTRE');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = 135; // Altura de la imagen del bracket
    const topMargin = 10; // Margen superior

    // Renderizar el contenido del div en un canvas
    const descriptionData: any = document.getElementById('pdfDescription');
    if (descriptionData) {
      html2canvas(descriptionData).then((descriptionCanvas) => {
        const descriptionImgData = descriptionCanvas.toDataURL('image/png');

        let y = topMargin + 5; // Posición Y de la imagen del bracket inicial

        const firstFourBrackets = this.brackets.slice(0, 4);

        firstFourBrackets.forEach((bracket, index) => {



          console.log(index);
          if (index > 0 && index % 2 === 0) {
            console.log(index);
            // Si es el segundo bracket en la página, agregar una nueva página y restablecer la posición Y
            pdf.addPage();
            y = topMargin + 15;
          }

          if (index % 2 === 0) {
            // Agregar descripción al inicio de la página
            pdf.addImage(descriptionImgData, 'PNG', 0, 0, imgWidth, 15);
          }

          const bracketData: any = document.getElementById(
            `bracket${index + 1}`
          );
          if (bracketData) {
            html2canvas(bracketData).then((bracketCanvas) => {
              const bracketImgData = bracketCanvas.toDataURL('image/png');
              pdf.addImage(bracketImgData, 'PNG', 0, y, imgWidth, imgHeight);
              y += imgHeight + 15; // Actualizar la posición Y para el próximo bracket
              if (index === 3) {
                // Si es el último bracket, guardar el PDF
                pdf.save(`championship.pdf`);
              }
            });
          }
        });
      });
    } else {
      console.error('Elemento pdfDescription no encontrado.');
    }
  }*/
  /*
  generatePDF(): void {
    console.log('ENTRE');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = 135; // Altura de la imagen del bracket
    const topMargin = 10; // Margen superior

    // Renderizar el contenido del div en un canvas
    const descriptionData: any = document.getElementById('pdfDescription');
    if (descriptionData) {
      html2canvas(descriptionData).then((descriptionCanvas) => {
        const descriptionImgData = descriptionCanvas.toDataURL('image/png');

        let y = topMargin + 5; // Posición Y de la imagen del bracket inicial

        const firstFourBrackets = this.brackets.slice(0, 6);

        firstFourBrackets.forEach((bracket, index) => {
          console.log(index);
          if (index === 0) {
            pdf.addImage(descriptionImgData, 'PNG', 0, 0, imgWidth, 15);
            const bracketData: any = document.getElementById(`bracket${index}`);
            if (bracketData) {
              console.log('AGREGANDO BRACKET0');
              html2canvas(bracketData).then((bracketCanvas) => {
                const bracketImgData = bracketCanvas.toDataURL('image/png');
                pdf.addImage(bracketImgData, 'PNG', 0, y, imgWidth, imgHeight);
                y += imgHeight + 10; // Actualizar la posición Y para el próximo bracket
              });
            }
          } else {
            if (index % 2 === 0 && index > 0) {
              console.log('AGREGO PAGINA :', index);
              pdf.addPage();
              y = topMargin + 15;
            }
            if (index % 2 === 0) {
              console.log('AGREGO DESCRIPCION: ', index);
              pdf.addImage(descriptionImgData, 'PNG', 0, 0, imgWidth, 15);
            }
            const bracketData: any = document.getElementById(`bracket${index}`);
            if (bracketData) {
              console.log('AGREGANDO:', index);
              html2canvas(bracketData).then((bracketCanvas) => {
                const bracketImgData = bracketCanvas.toDataURL('image/png');
                pdf.addImage(bracketImgData, 'PNG', 0, y, imgWidth, imgHeight);
                y += imgHeight + 10; // Actualizar la posición Y para el próximo bracket
                if (index === 5) {
                  // Si es el último bracket, guardar el PDF
                  pdf.save(`championship.pdf`);
                }
              });
            }
          }
        });
      });
    } else {
      console.error('Elemento pdfDescription no encontrado.');
    }
  }*/

  async generatePDF(): Promise<void> {
    console.log('ENTRE');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = 125; // Altura de la imagen del bracket
    const topMargin = 0; // Margen superior

    // Renderizar el contenido del div en un canvas
    const descriptionData: any = document.getElementById('pdfDescription');
    if (descriptionData) {
      const descriptionCanvas = await html2canvas(descriptionData);
      const descriptionImgData = descriptionCanvas.toDataURL('image/png');

      let y = topMargin + 5; // Posición Y de la imagen del bracket inicial

      const firstFourBrackets = this.brackets.slice(0, 6);

      for (let index = 0; index < firstFourBrackets.length; index++) {
        if (index === 0) {
          pdf.addImage(descriptionImgData, 'PNG', 0, 0, imgWidth, 15);
          y = topMargin + 15;
        }
        if (index > 0 && index % 2 === 0) {
          pdf.addPage();
          y = topMargin + 15;
          pdf.addImage(descriptionImgData, 'PNG', 0, 0, imgWidth, 15);
        }

        const bracketData: any = document.getElementById(`bracket${index}`);
        if (bracketData) {
          const bracketCanvas = await html2canvas(bracketData);
          const bracketImgData = bracketCanvas.toDataURL('image/png');
          pdf.addImage(bracketImgData, 'PNG', 0, y, imgWidth, imgHeight);
          y += imgHeight + 10; // Actualizar la posición Y para el próximo bracket
          if (index === 5) {
            // Si es el último bracket, guardar el PDF
            pdf.save(`championship.pdf`);
          }
        }
      }
    } else {
      console.error('Elemento pdfDescription no encontrado.');
    }
  }

  getChampionshipDate(): string {
    const res = this.datePipe.transform(
      this.championship.championshipDate,
      'dd MMMM yyyy',
      'es'
    );
    if (res) {
      return res;
    } else {
      return '';
    }
  }
}
