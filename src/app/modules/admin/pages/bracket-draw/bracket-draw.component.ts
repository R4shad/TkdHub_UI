import { Component, OnInit } from '@angular/core';
import { jsPDF } from 'jspdf';
declare var html2canvas: any;

@Component({
  selector: 'app-bracket-draw',
  templateUrl: './bracket-draw.component.html',
  styleUrls: ['./bracket-draw.component.scss'],
})
export class BracketDrawComponent implements OnInit {
  displayBracket: boolean = false;

  constructor() {}

  ngOnInit(): void {}

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
