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
  correntClubCode: string = '';
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
    this.correntClubCode = club.clubCode;
  }

  cancelEdit(club: clubEI) {
    club.isEdit = false;
  }

  addClub() {
    const newClub: clubI = {
      clubCode: 'NEW',
      name: '',
      coachCi: 0,
      coachName: '',
    };
    const exists = this.clubs.some((club) => club.clubCode === 'NEW');
    if (!exists) {
      this.api
        .postClub(this.championshipId, newClub)
        .subscribe((response: responseClubI) => {
          console.log(response.status);
          if (response.status == 201) {
            const newClubEditable: clubEI = {
              clubCode: newClub.clubCode,
              name: newClub.name,
              coachCi: newClub.coachCi,
              coachName: newClub.coachName,
              isEdit: true,
            };
            this.correntClubCode = newClub.clubCode;
            this.clubs.unshift(newClubEditable);
            alert('Creado correctamente');
          }
        });
    } else {
      alert('Crea un club a la vez');
    }
  }

  confirmEdit(club: clubEI) {
    club.clubCode = club.clubCode.toUpperCase();
    const newClub: clubI = {
      name: club.name,
      clubCode: club.clubCode.toUpperCase(),
      coachCi: club.coachCi,
      coachName: club.coachName,
    };
    console.log(this.correntClubCode);
    console.log(newClub);
    this.api
      .editClub(this.championshipId, this.correntClubCode, newClub)
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
