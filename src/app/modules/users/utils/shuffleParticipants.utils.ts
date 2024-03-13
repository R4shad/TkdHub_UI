import { completeCompetitorI } from 'src/app/shared/models/competitor';

export function shuffleArray(
  array: completeCompetitorI[]
): completeCompetitorI[] {
  const shuffledArray = [...array]; // Copia el arreglo para evitar modificar el original
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[randomIndex]] = [
      shuffledArray[randomIndex],
      shuffledArray[i],
    ]; // Intercambia elementos
  }
  return shuffledArray;
}
