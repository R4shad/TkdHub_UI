import { agesI } from 'src/app/shared/models/ages';
import { categoryWithNumericValueI } from 'src/app/shared/models/category';
import { divisionI } from 'src/app/shared/models/division';

export function obtenerValorNumerico(grado: string): number {
  switch (grado.toLowerCase()) {
    case 'franja amarillo':
      return 1;
    case 'amarillo':
      return 2;
    case 'franja verde':
      return 3;
    case 'verde':
      return 4;
    case 'franja azul':
      return 5;
    case 'azul':
      return 6;
    case 'franja rojo':
      return 7;
    case 'rojo':
      return 8;
    case 'franja negro':
      return 9;
    case 'negro':
      return 10;
    default:
      return 0;
  }
}

export function getCompetitoryCategoryId(
  championshipCategories: categoryWithNumericValueI[],
  gradoParticipante: number
): number {
  for (const categoria of championshipCategories) {
    if (
      gradoParticipante >= categoria.gradeMin &&
      gradoParticipante <= categoria.gradeMax
    ) {
      return categoria.categoryId;
    }
  }
  return 0;
}

export function getCompetitorAgeIntervalId(
  championshipAgeIntrevals: agesI[],
  age: number
): number {
  for (const ageInterval of championshipAgeIntrevals) {
    if (age >= ageInterval.minAge && age <= ageInterval.maxAge) {
      return ageInterval.ageIntervalId;
    }
  }
  return 0;
}

export function getCompetitorDivisionId(
  championshipDivisions: divisionI[],
  ageIntervalId: number,
  competitorWeight: number,
  competitorGender: string
): number {
  const filteredDivisions = championshipDivisions.filter(
    (division) =>
      division.ageIntervalId === ageIntervalId &&
      division.gender === competitorGender
  );
  for (const division of filteredDivisions) {
    if (
      competitorWeight >= division.minWeight &&
      competitorWeight <= division.maxWeight
    ) {
      return division.divisionId;
    }
  }
  return 0;
}
