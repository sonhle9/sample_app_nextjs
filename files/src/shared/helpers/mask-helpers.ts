export const maskMesra = (mesra: string) =>
  mesra && mesra.replace(/(\d{7})(\d{5})(\d{5})/, '$1-$2-$3');

export const maskIDNumber = (idnumber: string) => idnumber && idnumber.substr(idnumber.length - 4);
