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
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ChampionshipI } from 'src/app/shared/models/Championship';

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
  championship!: ChampionshipI;
  championshipId: number = 0;
  correntClubCode: string = '';
  modalRef?: NgbModalRef | undefined;
  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.championshipId = Number(params.get('championshipId'));
    });
    this.api.getChampionshipInfo(this.championshipId).subscribe((data) => {
      this.championship = data;
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
      email: '',
      coachName: '',
    };
    const exists = this.clubs.some((club) => club.clubCode === 'NEW');
    if (!exists) {
      this.api
        .postClub(this.championshipId, newClub)
        .subscribe((response: responseClubI) => {
          console.log(response.status);
          if (response.status == 200) {
            const newClubEditable: clubEI = {
              clubCode: newClub.clubCode,
              name: newClub.name,
              email: newClub.email,
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
      email: club.email,
      coachName: club.coachName,
    };
    console.log(this.correntClubCode);
    console.log(newClub);
    this.api
      .editClub(this.championshipId, this.correntClubCode, newClub)
      .subscribe((response: responseClubI) => {
        alert('Editado correctamente');
        if (response.status == 200) {
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
    this.router.navigate(['/Championship', this.championshipId, 'Organizer']);
  }

  confirm() {
    if (this.modalRef) {
      // Verifica si modalRef está definido
      this.api
        .updateChampionshipStage(this.championshipId)
        .subscribe((data) => {
          if (data === 200) {
            this.api
              .updateChampionshipStage(this.championshipId)
              .subscribe((data) => {
                if (data === 200) {
                  if (this.modalRef != undefined) {
                    this.modalRef.close();
                  }
                  this.router.navigate([
                    '/Championship',
                    this.championshipId,
                    'Organizer',
                  ]);
                }
              });
          }
        });
    } else {
      console.warn('modalRef no está definido'); // Muestra una advertencia si modalRef no está definido
    }
  }

  openModal(content: any) {
    this.modalRef = this.modalService.open(content);
  }
}
