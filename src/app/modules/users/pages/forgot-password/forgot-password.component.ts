import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  championshipId!: number;
  mail: string = '';
  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const championshipIdStr = params.get('championshipId');
      if (championshipIdStr) {
        this.championshipId = Number(championshipIdStr); // Convierte la cadena a número
      }
    });
  }

  submitForm() {
    this.api.sendEmail(this.championshipId, this.mail).subscribe({
      next: (response) => {
        console.log(response);
        if (response.status === 200) {
          alert('Contraseña creada correctamente');
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('Error al crear contraseña:', error);
      },
    });
  }
}
