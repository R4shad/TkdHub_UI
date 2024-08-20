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

  password1: string = '';
  password2: string = '';
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

  submitForm() {
    if (this.password1 !== this.password2) {
      alert('Las contraseñas no coinciden');
      this.differentPasswords = true; // Establecer la bandera si las contraseñas son diferentes
    } else {
      this.differentPasswords = false; // Restablecer la bandera si las contraseñas son iguales

      const password = this.password1;

      // Llama a tu método de actualización de contraseña aquí
      this.api.updateUserPassword(this.rol, this.email, password).subscribe({
        next: (response) => {
          console.log(response);
          if (response.status === 200) {
            alert('Contraseña creada correctamente');
            this.password1 = ''; // Limpia el campo de contraseña
            this.password2 = ''; // Limpia el campo de repetir contraseña
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          console.error('Error al crear contraseña:', error);
        },
      });
    }
  }
}
