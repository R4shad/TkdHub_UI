import { Component, OnInit } from '@angular/core';
import { jsPDF } from 'jspdf';
declare var html2canvas: any;

@Component({
  selector: 'app-four-participants-bracket',
  templateUrl: './four-participants-bracket.component.html',
  styleUrls: ['./four-participants-bracket.component.scss'],
})
export class FourParticipantsBracketComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  generatePDF(): void {
    console.log('Generando PDF...');
    // Espera a que html2canvas se cargue antes de llamar a su método
    if (typeof html2canvas !== 'undefined') {
      html2canvas(document.querySelector('.theme')).then((canvas: any) => {
        // Obtiene el objeto canvas

        // Convierte el canvas en una imagen base64
        var imgData = canvas.toDataURL('image/png');

        // Crea un nuevo objeto PDF
        var pdf = new jsPDF();

        // Agrega la imagen al PDF
        pdf.addImage(imgData, 'PNG', 0, 0, 120, 120);

        // Guarda el PDF
        pdf.save('bracket.pdf');
      });
    } else {
      console.error('html2canvas no está definido');
    }
  }
}
