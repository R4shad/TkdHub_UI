import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
@Component({
  selector: 'app-championship-creator',
  templateUrl: './championship-creator.component.html',
  styleUrls: ['./championship-creator.component.scss'],
})
export class ChampionshipCreatorComponent implements OnInit {
  constructor(private api: ApiService) {}

  ngOnInit(): void {}

  submitForm(championshipForm: any) {
    if (championshipForm.valid) {
      const formData = championshipForm.value;
      console.log(formData);

      this.api.createChampionship(formData).subscribe({
        next: (response) => {
          if (response.status === 201) {
            alert('Creado correctamente');
            this.insertInitialData(response.data.championshipId);
            championshipForm.reset();
          }
        },
        error: (error) => {
          console.error('Error al crear:', error);
        },
      });
    } else {
      console.log('Formulario no válido');
    }
  }
  insertInitialData(championshipId: number) {
    this.api.postChampionshipDivision(championshipId).subscribe((data) => {
      console.log(data);
    });
    this.api.postChampionshipCategory(championshipId).subscribe((data) => {
      console.log(data);
    });
  }
}
