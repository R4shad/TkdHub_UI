import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { ChampionshipI } from 'src/app/shared/models/Championship';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  championships: ChampionshipI[] = [];
  displayedChampionships: ChampionshipI[] = [];
  currentSlideIndex: number = 0;
  cant = new Array(7);
  chunkSize = 1; // Cantidad de campeonatos a cargar por vez

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.showAllChampionships();
    this.startSlider();
  }

  showAllChampionships() {
    this.api.getAllChampionships().subscribe((data) => {
      this.championships = data.sort((a, b) => {
        return (
          new Date(a.championshipDate).getTime() -
          new Date(b.championshipDate).getTime()
        );
      });

      this.championships.reverse();
      console.log(this.championships);
      this.displayedChampionships = this.championships.slice(0, 1);
    });
  }

  navigateToChampionship(championshipId: number) {
    const url = `/Championship/${championshipId}`;
    this.router.navigateByUrl(url);
  }

  loadMoreChampionships() {
    const endIndex = Math.min(
      this.displayedChampionships.length + this.chunkSize,
      this.championships.length
    );
    this.displayedChampionships = this.championships.slice(0, endIndex);
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

  startSlider() {
    setInterval(() => {
      if (this.currentSlideIndex >= 7) {
        this.currentSlideIndex = 1;
      }
      this.currentSlideIndex =
        (this.currentSlideIndex + 1) % this.championships.length;
    }, 5000); // Cambia cada 5 segundos
  }
}
