import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-user-password',
  templateUrl: './create-user-password.component.html',
  styleUrls: ['./create-user-password.component.scss'],
})
export class CreateUserPasswordComponent implements OnInit {
  email: string = '';
  rol: string = '';
  differentPasswords: boolean = false;
  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const email = params.get('email');
      if (email) {
        this.email = email;
      }
      const rol = params.get('user');
      if (rol) {
        if (rol === 'Organizer') {
          this.rol = 'Organizador';
        }
        if (rol === 'Coach') {
          this.rol = 'Coach';
        }
        if (rol === 'Scorer') {
          this.rol = 'Anotador';
        }
      }
    });
  }

  submitForm(championshipForm: any) {
    if (championshipForm.valid) {
      const formData = championshipForm.value;
      if (formData.password1 !== formData.password2) {
        this.differentPasswords = true; // Establecer la bandera si las contraseñas son diferentes
      } else {
        this.differentPasswords = false; // Restablecer la bandera si las contraseñas son iguales
        const password = formData.password1;

        this.api.updateUserPassword(this.rol, this.email, password).subscribe({
          next: (response) => {
            console.log(response);
            if (response.status === 200) {
              alert('Creada correctamente');
              championshipForm.reset();
            }
          },
          error: (error) => {
            console.error('Error al crear:', error);
          },
        });
      }
    } else {
      console.log('Formulario no válido');
    }
  }
}
