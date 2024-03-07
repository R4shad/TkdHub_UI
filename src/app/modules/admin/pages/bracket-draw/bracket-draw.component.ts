import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';

import { jsPDF } from 'jspdf';
import {
  bracketI,
  bracketWithCompetitorsI,
  bracketWithMatchesI,
} from 'src/app/shared/models/bracket';
import { divisionI } from 'src/app/shared/models/division';
declare var html2canvas: any;

@Component({
  selector: 'app-bracket-draw',
  templateUrl: './bracket-draw.component.html',
  styleUrls: ['./bracket-draw.component.scss'],
})
export class BracketDrawComponent implements OnInit {
  championshipId: number = 0;
  brackets: bracketWithCompetitorsI[] = [];
  bracketsWithMatchs: bracketWithMatchesI[] = [];
  divisions: divisionI[] = [];
  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.championshipId = Number(params.get('championshipId'));
    });

    this.getData();
  }

  getData() {
    this.api
      .getBracketsWithCompetitors(this.championshipId)
      .subscribe((data) => {
        this.brackets = data;
        console.log(this.brackets);
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

  returnToSummary() {
    this.router.navigate(['/championship', this.championshipId, 'Organizer']);
  }

  generatePDF(): void {
    console.log('Generando PDF...');
    // Espera a que html2canvas se cargue antes de llamar a su método
    if (typeof html2canvas !== 'undefined') {
      const bracketPages = document.querySelectorAll('.bracket');
      const pdf = new jsPDF();
      let currentY = 0;
      console.log(bracketPages);
      bracketPages.forEach((page, index) => {
        html2canvas(page).then((canvas: any) => {
          // Convierte el canvas en una imagen base64
          const imgData = canvas.toDataURL('image/png');

          // Si no es la primera página, añade una nueva página al PDF
          if (index > 0) {
            pdf.addPage();
          }

          // Agrega la imagen al PDF
          pdf.addImage(imgData, 'PNG', 0, currentY, 210, 297); // A4 size: 210x297 mm
          currentY += canvas.height * (210 / canvas.width); // Incrementa la posición Y

          // Si es la última página, guarda el PDF
          if (index === bracketPages.length - 1) {
            pdf.save('bracket.pdf');
          }
        });
      });
    } else {
      console.error('html2canvas no está definido');
    }
  }
}
