import { divisionI } from 'src/app/shared/models/division';
import { participantToValidateI } from 'src/app/shared/models/participant';

export function isParticipantWithinWeightRange(
  participant: participantToValidateI,
  weightRange: any
): boolean {
  const minWeight = weightRange.min;
  const maxWeight = weightRange.max;
  return participant.weight >= minWeight && participant.weight <= maxWeight;
}

export function isDivisionWithinAgeInterval(
  division: divisionI,
  ageIntervalValue: string,
  ageFilter: string
): boolean {
  if (ageIntervalValue === 'Todos') {
    return true;
  } else {
    const ageFilterNumber = parseInt(ageFilter, 10);
    return division.ageIntervalId === ageFilterNumber;
  }
}
