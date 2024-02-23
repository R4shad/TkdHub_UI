import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import {
  clubI,
  clubNameI,
  responseClubI,
  responseClubsI,
} from 'src/app/shared/models/Club';

interface clubEI extends clubI {
  isEdit: boolean;
}

@Component({
  selector: 'app-trainer-registration',
  templateUrl: './trainer-registration.component.html',
  styleUrls: ['./trainer-registration.component.scss'],
})
export class TrainerRegistrationComponent implements OnInit {
  clubs: clubEI[] = [];
  championshipId: number = 0;
  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.championshipId = Number(params.get('championshipId'));
    });
    this.displayClubs();
  }

  displayClubs() {
    this.api.getClubs(this.championshipId).subscribe((data: clubI[]) => {
      const clubsWithEditFlag = data.map((club) => ({
        ...club,
        isEdit: false,
      }));
      this.clubs = clubsWithEditFlag;
    });
    console.log(this.clubs);
  }

  onEdit(club: clubEI) {
    this.clubs.forEach((club) => {
      club.isEdit = false;
    });
    club.isEdit = true;
  }

  cancelEdit(club: clubEI) {
    club.isEdit = false;
  }

  addParticipant() {
    const newClub: clubI = {
      clubCode: '',
      name: '',
    };

    this.api
      .postClub(this.championshipId, newClub)
      .subscribe((response: responseClubI) => {
        if (response.status == 201) {
          const newClubEditable: clubEI = {
            clubCode: newClub.clubCode,
            name: newClub.name,
            isEdit: true,
          };

          this.clubs.unshift(newClubEditable);
          alert('Creado correctamente');
        }
      });
  }

  confirmEdit(club: clubEI) {
    const newClub: clubNameI = {
      name: club.name,
    };
    this.api
      .editClub(this.championshipId, club.clubCode, newClub)
      .subscribe((response: responseClubI) => {
        if (response.status == 200) {
          alert('Editado correctamente');
          club.isEdit = false;
        }
      });
  }

  onDelete(club: clubEI) {
    const confirmation = window.confirm(
      '¿Estás seguro que quieres eliminar este participante?'
    );
    if (confirmation) {
      this.api
        .deleteClub(this.championshipId, club.clubCode)
        .subscribe((response: responseClubI) => {
          if (response.status == 200) {
            this.clubs = this.clubs.filter((c) => c !== club);
            alert('Eliminado correctamente');
          }
        });
    }
  }

  returnToSummary() {
    this.router.navigate(['/championship', this.championshipId, 'Organizer']);
  }
}
