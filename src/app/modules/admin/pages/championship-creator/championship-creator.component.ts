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
          alert('Creado correctamente');
        },
        error: (error) => {
          console.error('Error al crear:', error);
        },
      });
    } else {
      console.log('Formulario no válido');
    }
  }
}
