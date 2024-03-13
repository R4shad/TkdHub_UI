export function joinNames(firstNames: string, lastNames: string) {
  const firstName = firstNames.split(' ')[0]; // Obtener el primer nombre
  const lastName = lastNames.split(' ')[0]; // Obtener el primer apellido
  return `${firstName} ${lastName}`; // Unir el primer nombre y el primer apellido
}
